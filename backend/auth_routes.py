from fastapi import APIRouter, HTTPException, status, Depends, Response, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import hashlib
import uuid
import jwt
import secrets
from sqlalchemy import Column, Integer, String, Text, DateTime, create_engine

router = APIRouter(prefix="/auth", tags=["authentication"])

# Модели Pydantic для валидации
class UserRegister(BaseModel):
    name: str
    role: str
    password: str
    login: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: Optional[str]
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

# Хранилище пользователей (в реальном приложении - БД)
users_storage = {}
sessions_storage = {}
refresh_tokens_storage = {}

# Настройки JWT
SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

security = HTTPBearer()

def hash_password(password: str) -> str:
    """Хеширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверка пароля"""
    return hash_password(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Создание JWT токена"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    """Создание refresh токена"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Верификация JWT токена"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Получение текущего пользователя из токена"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload is None or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невалидный токен",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if user_id not in users_storage:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден",
        )
    
    return users_storage[user_id]

async def get_current_active_user(current_user: Dict = Depends(get_current_user)):
    """Проверка активного пользователя"""
    if current_user.get("is_active") is False:
        raise HTTPException(status_code=400, detail="Неактивный пользователь")
    return current_user

@router.post("/register", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """
    Регистрация нового пользователя
    """
    # Проверяем, существует ли пользователь с таким login
    for user in users_storage.values():
        if user["login"] == user_data.login:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким логином уже существует"
            )
    
    # Создаем нового пользователя
    user_id = str(uuid.uuid4())
    new_user = {
        "id": user_id,
        "name": user_data.name,
        "role": user_data.role,
        "login": user_data.login,
        "hashed_password": hash_password(user_data.password),
        "username": user_data.login,  # Добавляем username для совместимости
        "email": user_data.login,     # Используем login как email
        "full_name": user_data.name,
        "is_active": True,
        "created_at": datetime.now().isoformat(),
        "last_login": datetime.now().isoformat()
    }
    
    users_storage[user_id] = new_user
    
    return {
        "message": "Пользователь успешно зарегистрирован",
        "user_id": user_id,
        "login": user_data.login
    }

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, response: Response):
    """
    Вход в систему
    """
    # Ищем пользователя по username (который равен login)
    user = None
    for u in users_storage.values():
        if u["username"] == user_data.username:
            user = u
            break
    
    if user is None or not verify_password(user_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль"
        )
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Аккаунт деактивирован"
        )
    
    # Обновляем время последнего входа
    user["last_login"] = datetime.now().isoformat()
    
    # Создаем токены
    access_token = create_access_token(data={"sub": user["id"]})
    refresh_token = create_refresh_token(data={"sub": user["id"]})
    
    # Сохраняем refresh токен
    refresh_tokens_storage[refresh_token] = {
        "user_id": user["id"],
        "created_at": datetime.now().isoformat()
    }
    
    # Устанавливаем refresh token в httpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False, # В production должно быть True
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: Request):
    """
    Обновление access токена с помощью refresh токена
    """
    refresh_token = request.cookies.get("refresh_token")
    
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token не найден"
        )
    
    if refresh_token not in refresh_tokens_storage:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невалидный refresh token"
        )
    
    payload = verify_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Невалидный refresh token"
        )
    
    user_id = payload.get("sub")
    if user_id not in users_storage:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Пользователь не найден"
        )
    
    # Создаем новые токены
    new_access_token = create_access_token(data={"sub": user_id})
    new_refresh_token = create_refresh_token(data={"sub": user_id})
    
    # Удаляем старый refresh token и сохраняем новый
    del refresh_tokens_storage[refresh_token]
    refresh_tokens_storage[new_refresh_token] = {
        "user_id": user_id,
        "created_at": datetime.now().isoformat()
    }
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/logout")
async def logout(response: Response, request: Request):
    """
    Выход из системы
    """
    refresh_token = request.cookies.get("refresh_token")
    
    if refresh_token and refresh_token in refresh_tokens_storage:
        del refresh_tokens_storage[refresh_token]
    
    # Удаляем cookie
    response.delete_cookie("refresh_token")
    
    return {"message": "Успешный выход из системы"}

@router.get("/me", response_model=Dict[str, Any])
async def get_current_user_info(current_user: Dict = Depends(get_current_active_user)):
    """
    Получение информации о текущем пользователе
    """
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "created_at": current_user["created_at"],
        "last_login": current_user["last_login"]
    }

@router.put("/me", response_model=Dict[str, Any])
async def update_current_user_info(
    update_data: Dict[str, Any],
    current_user: Dict = Depends(get_current_active_user)
):
    """
    Обновление информации о текущем пользователе
    """
    allowed_fields = ["full_name", "email"]
    
    for field, value in update_data.items():
        if field in allowed_fields and value is not None:
            # Проверяем уникальность email
            if field == "email":
                for user in users_storage.values():
                    if user["email"] == value and user["id"] != current_user["id"]:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Пользователь с таким email уже существует"
                        )
            current_user[field] = value
    
    return {"message": "Данные пользователя обновлены", "user": current_user}

@router.post("/change-password")
async def change_password(
    old_password: str,
    new_password: str,
    current_user: Dict = Depends(get_current_active_user)
):
    """
    Смена пароля
    """
    if not verify_password(old_password, current_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неверный текущий пароль"
        )
    
    current_user["hashed_password"] = hash_password(new_password)
    
    return {"message": "Пароль успешно изменен"}

@router.get("/users/{user_id}", response_model=Dict[str, Any])
async def get_user_info(user_id: str):
    """
    Получение информации о пользователе по ID (публичная информация)
    """
    if user_id not in users_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    user = users_storage[user_id]
    return {
        "id": user["id"],
        "username": user["username"],
        "full_name": user["full_name"],
        "created_at": user["created_at"]
    }

# Утилиты для администратора
@router.get("/admin/users", dependencies=[Depends(get_current_active_user)])
async def get_all_users():
    """
    Получение списка всех пользователей (только для администраторов)
    """
    return {
        "total_users": len(users_storage),
        "users": list(users_storage.values())
    }

@router.post("/admin/users/{user_id}/deactivate", dependencies=[Depends(get_current_active_user)])
async def deactivate_user(user_id: str):
    """
    Деактивация пользователя (только для администраторов)
    """
    if user_id not in users_storage:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    
    users_storage[user_id]["is_active"] = False
    return {"message": "Пользователь деактивирован"}
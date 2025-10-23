from fastapi import APIRouter, status, HTTPException, Form, File, UploadFile
from typing import List, Optional, Dict, Any
from fastapi.responses import JSONResponse
import json
from pathlib import Path

router = APIRouter(prefix="/locations", tags=["locations"])

# Временное хранилище для локаций (вместо БД)
locations_storage = []

# Модель локации в виде словаря для валидации
LOCATION_MODEL = {
    "id": int,
    "description": str,
    "photo": str,
    "workTime": str,
    "contacts": dict
}

def find_location(location_id: int):
    """Поиск локации по ID"""
    for location in locations_storage:
        if location["id"] == location_id:
            return location
    return None

def validate_location_data(data: dict) -> bool:
    """Валидация данных локации"""
    try:
        # Проверяем обязательные поля
        required_fields = ["id", "description", "addres", "coords", "workTime", "contacts"]
        for field in required_fields:
            if field not in data:
                return False
        
        # Проверяем типы данных
        if not isinstance(data["id"], int):
            return False
        if not isinstance(data["contacts"], dict):
            return False
            
        return True
    except:
        return False

@router.get("/", response_model=List[Dict[str, Any]])
def get_all_locations():
    """
    Получить все туристические локации
    """
    return locations_storage

@router.get("/{location_id}")
def get_location(location_id: int):
    """
    Получить конкретную туристическую локацию по ID
    """
    location = find_location(location_id)
    
    if location is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Туристическая локация не найдена"
        )
    
    return location

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/uploadfile")
async def create_upload_file(location_id: int = Form(...), file: UploadFile = File(...)):  
    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    file_url = f"/uploads/{file.filename}"

    result = next((item for item in locations_storage if item["id"] == location_id), None)

    result['photo'] = file_url

    return {"filename": file.filename, "url": file_url}

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_location(data: dict):
    """
    Создать новую туристическую локацию
    """
    # Валидация данных
    if not validate_location_data(data):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Некорректные данные локации"
        )
    
    # Проверяем, существует ли уже локация с таким ID
    existing_location = find_location(data['id'])
    if existing_location:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Локация с таким ID уже существует"
        )
    
    # Создаем новую локацию
    location = {
        "id": data['id'],
        "name": data['name'],
        "description": data['description'],
        "addres": data['addres'],
        "coords": data['coords'],
        "photo": data.get('photo', ''),
        "workTime": data['workTime'],
        "contacts": data['contacts']  # Уже должен быть словарем
    }
    
    # Добавляем в хранилище
    locations_storage.append(location)
    
    return {
        "message": "Туристическая локация успешно создана",
        "location_id": location["id"],
        "location": location
    }

@router.put("/{location_id}")
def update_location(location_id: int, data: dict):
    """
    Обновить информацию о туристической локации
    """
    location = find_location(location_id)
    
    if location is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Туристическая локация не найдена"
        )
    
    # Обновляем поля локации
    if 'description' in data:
        location["description"] = data['description']
    if 'addres' in data:
        location["addres"] = data['addres']
    if 'coords' in data:
        location["coords"] = data['coords']
    if 'photo' in data:
        location["photo"] = data['photo']
    if 'workTime' in data:
        location["workTime"] = data['workTime']
    if 'contacts' in data:
        location["contacts"] = data['contacts']
    
    return {
        "message": "Туристическая локация успешно обновлена",
        "location_id": location_id,
        "updated_location": location
    }
@router.delete("/{location_id}")
def delete_location(location_id: int):
    """
    Удалить туристическую локацию
    """
    location = find_location(location_id)
    
    if location is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Туристическая локация не найдена"
        )
    
    # Удаляем локацию из хранилища
    locations_storage.remove(location)
    
    return {
        "message": "Туристическая локация успешно удалена",
        "location_id": location_id
    }

@router.get("/search/")
def search_locations(
    address: Optional[str] = None,
    description: Optional[str] = None,
    work_time: Optional[str] = None
):
    """
    Поиск туристических локаций по различным параметрам
    """
    results = locations_storage.copy()
    
    if address:
        results = [loc for loc in results if address.lower() in loc["addres"].lower()]
    
    if description:
        results = [loc for loc in results if description.lower() in loc["description"].lower()]
    
    if work_time:
        results = [loc for loc in results if work_time.lower() in loc["workTime"].lower()]
    
    return {
        "found_count": len(results),
        "locations": results
    }

@router.get("/{location_id}/contacts")
def get_location_contacts(location_id: int):
    """
    Получить контакты конкретной локации
    """
    location = find_location(location_id)
    
    if location is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Туристическая локация не найдена"
        )
    
    return {
        "location_id": location_id,
        "contacts": location["contacts"]
    }

@router.get("/{location_id}/details")
def get_location_details(location_id: int):
    """
    Получить детальную информацию о локации
    """
    location = find_location(location_id)
    
    if location is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Туристическая локация не найдена"
        )
    
    return {
        "location_id": location_id,
        "address": location["addres"],
        "coordinates": location["coords"],
        "working_hours": location["workTime"],
        "description": location["description"],
        "photo": location["photo"],
        "contacts": location["contacts"]
    }

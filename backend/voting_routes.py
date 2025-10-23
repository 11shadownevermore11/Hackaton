from fastapi import APIRouter, status, HTTPException, Cookie, Response
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import uuid

router = APIRouter(prefix="/voting", tags=["voting"])


votes_storage = {} # {location_id: {user_id: rating}}
user_sessions = {} # {session_id: {user_id, last_activity}}


MAX_RATING = 5
MIN_RATING = 1
SESSION_DURATION_HOURS = 24

def get_or_create_user_id(session_id: Optional[str] = None) -> str:
    """Получить или создать ID пользователя"""
    if not session_id or session_id not in user_sessions:
        new_session_id = str(uuid.uuid4())
        user_id = str(uuid.uuid4())
        user_sessions[new_session_id] = {
            "user_id": user_id,
            "last_activity": datetime.now()
        }
        return new_session_id, user_id
    
    
    user_sessions[session_id]["last_activity"] = datetime.now()
    return session_id, user_sessions[session_id]["user_id"]

def cleanup_expired_sessions():
    """Очистка просроченных сессий"""
    expired_sessions = []
    for session_id, session_data in user_sessions.items():
        if datetime.now() - session_data["last_activity"] > timedelta(hours=SESSION_DURATION_HOURS):
            expired_sessions.append(session_id)
    
    for session_id in expired_sessions:
        del user_sessions[session_id]

@router.post("/{location_id}/rate")
def rate_location(
    location_id: int,
    rating: int,
    response: Response,
    session_id: Optional[str] = Cookie(None)
):
    """
    Оценить туристическую локацию
    """
    if rating < MIN_RATING or rating > MAX_RATING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Рейтинг должен быть от {MIN_RATING} до {MAX_RATING}"
        )
    
   
    cleanup_expired_sessions()
    
    
    new_session_id, user_id = get_or_create_user_id(session_id)
    
    # Устанавливаем куки, если это новая сессия
    if not session_id:
        response.set_cookie(
            key="session_id",
            value=new_session_id,
            httponly=True,
            max_age=SESSION_DURATION_HOURS * 3600
        )
    
   
    if location_id not in votes_storage:
        votes_storage[location_id] = {}
    
    
    votes_storage[location_id][user_id] = {
        "rating": rating,
        "timestamp": datetime.now().isoformat()
    }
    
    return {
        "message": "Спасибо за вашу оценку!",
        "location_id": location_id,
        "rating": rating,
        "user_voted": True
    }

@router.get("/{location_id}/stats")
def get_location_voting_stats(location_id: int):
    """
    Получить статистику голосования для локации
    """
    if location_id not in votes_storage or not votes_storage[location_id]:
        return {
            "location_id": location_id,
            "average_rating": 0,
            "total_votes": 0,
            "rating_distribution": {str(i): 0 for i in range(MIN_RATING, MAX_RATING + 1)},
            "message": "Пока нет оценок для этой локации"
        }
    
    votes = votes_storage[location_id]
    ratings = [vote_data["rating"] for vote_data in votes.values()]
    
   
    average_rating = sum(ratings) / len(ratings)
    rating_distribution = {str(i): 0 for i in range(MIN_RATING, MAX_RATING + 1)}
    
    for rating in ratings:
        rating_distribution[str(rating)] += 1
    
    return {
        "location_id": location_id,
        "average_rating": round(average_rating, 2),
        "total_votes": len(ratings),
        "rating_distribution": rating_distribution,
        "max_rating": MAX_RATING,
        "min_rating": MIN_RATING
    }

@router.get("/{location_id}/my-rating")
def get_my_rating(
    location_id: int,
    session_id: Optional[str] = Cookie(None)
):
    """
    Получить мою оценку для локации
    """
    if not session_id or session_id not in user_sessions:
        return {
            "location_id": location_id,
            "has_voted": False,
            "message": "Вы еще не оценивали эту локацию"
        }
    
    user_id = user_sessions[session_id]["user_id"]
    
    if (location_id in votes_storage and 
        user_id in votes_storage[location_id]):
        
        rating_data = votes_storage[location_id][user_id]
        return {
            "location_id": location_id,
            "has_voted": True,
            "my_rating": rating_data["rating"],
            "voted_at": rating_data["timestamp"]
        }
    else:
        return {
            "location_id": location_id,
            "has_voted": False,
            "message": "Вы еще не оценивали эту локацию"
        }

@router.put("/{location_id}/update-rating")
def update_rating(
    location_id: int,
    new_rating: int,
    session_id: Optional[str] = Cookie(None)
):
    """
    Обновить свою оценку локации
    """
    if not session_id or session_id not in user_sessions:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Необходимо сначала оценить локацию"
        )
    
    if new_rating < MIN_RATING or new_rating > MAX_RATING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Рейтинг должен быть от {MIN_RATING} до {MAX_RATING}"
        )
    
    user_id = user_sessions[session_id]["user_id"]
    
    if (location_id not in votes_storage or 
        user_id not in votes_storage[location_id]):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сначала нужно оценить локацию"
        )
    
    # Обновляем оценку
    old_rating = votes_storage[location_id][user_id]["rating"]
    votes_storage[location_id][user_id] = {
        "rating": new_rating,
        "timestamp": datetime.now().isoformat()
    }
    
    return {
        "message": "Оценка обновлена",
        "location_id": location_id,
        "old_rating": old_rating,
        "new_rating": new_rating
    }

@router.delete("/{location_id}/remove-rating")
def remove_rating(
    location_id: int,
    session_id: Optional[str] = Cookie(None)
):
    """
    Удалить свою оценку локации
    """
    if not session_id or session_id not in user_sessions:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Не авторизован"
        )
    
    user_id = user_sessions[session_id]["user_id"]
    
    if (location_id in votes_storage and 
        user_id in votes_storage[location_id]):
        
        del votes_storage[location_id][user_id]
        
       
        if not votes_storage[location_id]:
            del votes_storage[location_id]
        
        return {
            "message": "Ваша оценка удалена",
            "location_id": location_id
        }
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Оценка не найдена"
        )

@router.get("/top-rated")
def get_top_rated_locations(limit: int = 10):
    """
    Получить топ локаций по рейтингу
    """
    location_stats = []
    
    for location_id in votes_storage:
        if votes_storage[location_id]:
            ratings = [vote_data["rating"] for vote_data in votes_storage[location_id].values()]
            average_rating = sum(ratings) / len(ratings)
            location_stats.append({
                "location_id": location_id,
                "average_rating": round(average_rating, 2),
                "total_votes": len(ratings)
            })
    
    
    sorted_locations = sorted(
        location_stats, 
        key=lambda x: (x["average_rating"], x["total_votes"]), 
        reverse=True
    )[:limit]
    
    return {
        "top_locations": sorted_locations,
        "limit": limit
    }

@router.get("/recent-votes")
def get_recent_votes(limit: int = 20):
    """
    Получить последние оценки
    """
    all_votes = []
    
    for location_id in votes_storage:
        for user_id, vote_data in votes_storage[location_id].items():
            all_votes.append({
                "location_id": location_id,
                "user_id": user_id[:8] + "...", 
                "rating": vote_data["rating"],
                "timestamp": vote_data["timestamp"]
            })
    
    
    sorted_votes = sorted(
        all_votes, 
        key=lambda x: x["timestamp"], 
        reverse=True
    )[:limit]
    
    return {
        "recent_votes": sorted_votes,
        "limit": limit
    }
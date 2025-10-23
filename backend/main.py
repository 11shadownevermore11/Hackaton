from fastapi import FastAPI, status
from utils import json_to_dict_list
import os
from typing import Optional
from fastapi.responses import HTMLResponse
import json
from sqlalchemy import Column, Integer, String, Text, DateTime, create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from fastapi.responses import JSONResponse, FileResponse
from fastapi import File, UploadFile, Body
from personal_routes import router as locations_router
from voting_routes import router as voting_router
from fastapi.middleware.cors import CORSMiddleware
from auth_routes import router as auth_router
from pathlib import Path


app = FastAPI(
    title="Tourist App API", 
    description="API для туристического приложения с информацией о локациях"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(locations_router)
app.include_router(voting_router)
app.include_router(auth_router)


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "tourist_app_with_voting"}

 
@app.get("/")
def read_root():
    html_content = "<h2></h2>"
    return HTMLResponse(content=html_content)

class Base(DeclarativeBase): 
    pass

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(Text)
    addres = Column(String(200), nullable=False)
    coords = Column(String(200))
    photo = Column(String(200))
    workTime = Column(String(200))
    contacts = Column(String(200))

objective_storage = []
objective = []

def find_problem(id):
    for problem in objective_storage: 
        if problem.id == id:
            return problem
    return None

@app.get("/location/{id}")
def get_problem(id):
   
    problem = find_problem(id)
    print(problem)
   
    if problem==None:  
        return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND, 
                content={ "message": "Задача не найдена" }
        )
   
    return problem
 
 
@app.get("/")
def read_root():
    html_content = "<h2></h2>"
    return HTMLResponse(content=html_content)

def create_location(data  = Body()):
    contacts = json.dumps(data['contacts'])
    
    

    location = Location(
        id = data['id'],
        description = data['description'],
        addres = data['addres'],
        coords = data['coords'],
        photo = data['photo'],
        workTime = data['workTime'],
        contacts = contacts
    )

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
@app.get("/uploads/{filename}")
async def get_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        return {"error": "File not found"}
    return FileResponse(file_path)

@app.get("/")
def read_root():
    return {
        "message": "Добро пожаловать в туристическое приложение!",
        "endpoints": {
             "authentication": {
                "register": "/auth/register",
                "login": "/auth/login",
                "refresh": "/auth/refresh",
                "logout": "/auth/logout",
                "profile": "/auth/me"
            },
            "locations": {
                "all_locations": "/locations/",
                "get_location": "/locations/{id}",
                "create_location": "/locations/",
                "search_locations": "/locations/search/"
            },
            "voting": {
                "rate_location": "/voting/{id}/rate",
                "location_stats": "/voting/{id}/stats",
                "my_rating": "/voting/{id}/my-rating"
            }
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "tourist_appwith_auth"}


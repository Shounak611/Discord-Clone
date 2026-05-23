from fastapi import APIRouter, HTTPException, Query, status
from app.models import Users
from app.dependencies import db_dependency, current_user_dependency
from pydantic import BaseModel
from typing import Optional

router = APIRouter(
    prefix="/get_user",
    tags=["get_user"]
)

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    username: Optional[str] = None

@router.get("/", status_code=status.HTTP_200_OK)
async def search_user(db: db_dependency, current_user: current_user_dependency, email: str = Query(..., min_length=3)):
    if current_user.email != email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    user_model = db.query(Users).filter(Users.email == email).first()
    if user_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return user_model

@router.put("/update", status_code=status.HTTP_200_OK)
async def update_user(db: db_dependency, current_user: current_user_dependency, user_update: UserUpdate):
    user_model = db.query(Users).filter(Users.id == current_user.id).first()
    if user_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if user_update.display_name is not None:
        user_model.display_name = user_update.display_name
        
    if user_update.username is not None:
        # Check if the username is taken by someone else
        existing_user = db.query(Users).filter(Users.username == user_update.username, Users.id != current_user.id).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username is already taken")
        user_model.username = user_update.username
        
    db.commit()
    db.refresh(user_model)
    return user_model
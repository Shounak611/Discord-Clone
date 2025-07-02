from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import SessionLocal
from starlette import status
from models import Users


router = APIRouter(
    prefix="/get_user",
    tags=["get_user"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]

@router.get("/",status_code=status.HTTP_200_OK)
async def search_user(db : db_dependency,email: str = Query(..., min_length=3)):
    user_model = db.query(Users).filter(Users.email == email).first()
    if user_model is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not found")
    return user_model
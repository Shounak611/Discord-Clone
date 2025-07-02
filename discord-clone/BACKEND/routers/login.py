from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import SessionLocal
from starlette import status
from models import Users
from passlib.context import CryptContext


router = APIRouter(
    prefix="/login",
    tags=["login"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]
bcrypt_context = CryptContext(schemes=["bcrypt"],deprecated = "auto")

class LoginRequest(BaseModel):
    email : EmailStr
    password : str

def check_user(request,model):
    if not bcrypt_context.verify(request.password,model.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="INVALID USER")
    return True

@router.post("/",status_code=status.HTTP_200_OK)
async def get_page(db: db_dependency,req:LoginRequest):
    user_model = db.query(Users).filter(Users.email == req.email).first()
    if user_model is None:
        raise HTTPException(status_code=404,detail="USER NOT FOUND")
    res=check_user(req,user_model)
    if res:
        return {"message":"WELCOME USER"}
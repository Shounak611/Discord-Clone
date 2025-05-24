from datetime import date
from typing import Annotated
from fastapi import APIRouter, Depends
from pydantic import BaseModel,EmailStr
from database import SessionLocal
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from starlette import status
from models import Users

router = APIRouter(
    prefix="/register",
    tags=["register"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]
bcrypt_context = CryptContext(schemes=["bcrypt"],deprecated = "auto")

class Register_request(BaseModel):
    email : EmailStr
    display_name : str
    username : str
    password : str
    dob : date

@router.get("/",status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency):
    return db.query(Users)

@router.post("/registration",status_code=status.HTTP_201_CREATED)
async def registration(db : db_dependency,reg_req : Register_request):
    new_user = Users(
        email = reg_req.email,
        display_name = reg_req.display_name,
        username = reg_req.username,
        hashed_password = bcrypt_context.hash(reg_req.password),
        dob = reg_req.dob,
    )
    db.add(new_user)
    db.commit()
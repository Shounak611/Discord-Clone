from datetime import date
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel,EmailStr, Field, field_validator
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
    password : str =Field(min_length=6)
    dob : date

    @field_validator("password")
    def validate_strong_password(cls, v):
        import re
        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', v):
            raise ValueError(
                "Password must be at least 8 characters long and include at least one uppercase letter, "
                "one lowercase letter, one digit, and one special character."
            )
        return v

@router.get("/",status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency):
    return db.query(Users)

@router.post("/registration",status_code=status.HTTP_201_CREATED)
async def registration(db : db_dependency,reg_req : Register_request):
    existing_user = db.query(Users).filter(Users.email == reg_req.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    new_user = Users(
        email = reg_req.email,
        display_name = reg_req.display_name,
        username = reg_req.username,
        hashed_password = bcrypt_context.hash(reg_req.password),
        dob = reg_req.dob,
    )
    db.add(new_user)
    db.commit()
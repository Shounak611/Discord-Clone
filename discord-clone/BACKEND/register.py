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
    password : str
    dob : date

    @field_validator("password")
    def validate_strong_password(cls, v):
        import re
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must include at least one uppercase letter.")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must include at least one lowercase letter.")
        if not re.search(r'\d', v):
            raise ValueError("Password must include at least one digit.")
        if not re.search(r'[@$!%*?&]', v):
            raise ValueError("Password must include at least one special character (@$!%*?&).")
        return v

@router.get("/",status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency):
    return db.query(Users)

@router.post("/registration",status_code=status.HTTP_201_CREATED)
async def registration(db : db_dependency,reg_req : Register_request):
    existing_user = db.query(Users).filter(Users.email == reg_req.email.strip()).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    if not reg_req.display_name.strip() or not reg_req.username.strip():
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,detail="Invalid username or display name")
    new_user = Users(
        email = reg_req.email.strip(),
        display_name = reg_req.display_name.strip(),
        username = reg_req.username.strip(),
        hashed_password = bcrypt_context.hash(reg_req.password),
        dob = reg_req.dob,
    )
    db.add(new_user)
    db.commit()
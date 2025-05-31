from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from starlette import status
from models import Users,FriendRequest


router = APIRouter(
    prefix="/friend",
    tags=["sent-requests"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]

@router.get("/send-requests/{email}")
async def get_pending_requests(email: str, db: db_dependency):
    sender = db.query(Users).filter(Users.email == email).first()
    if not sender:
        raise HTTPException(status_code=404, detail="User not found")
    
    requests = db.query(FriendRequest).filter(FriendRequest.sender_id == sender.id).all()
    result = []
    for req in requests:
        rec = db.query(Users).filter(Users.id == req.reciever_id).first()
        if rec is None:
            raise HTTPException(status_code=404, detail="User not found")
        result.append({
            "username": rec.username,
            "email": rec.email,
        })
    return result
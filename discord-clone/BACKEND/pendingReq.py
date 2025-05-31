from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from starlette import status
from models import Users,FriendRequest


router = APIRouter(
    prefix="/friend",
    tags=["pending-request"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]

@router.get("/pending-requests/{email}")
async def get_pending_requests(email: str, db: db_dependency):
    receiver = db.query(Users).filter(Users.email == email).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="User not found")
    
    requests = db.query(FriendRequest).filter(FriendRequest.reciever_id == receiver.id).all()
    result = []
    for req in requests:
        snd = db.query(Users).filter(Users.id == req.sender_id).first()
        if snd is None:
            raise HTTPException(status_code=404, detail="User not found")
        result.append({
            "username": snd.username,
            "email": snd.email,
        })
    return result

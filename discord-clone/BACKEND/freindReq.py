from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from starlette import status
from models import Users,FriendRequest


router = APIRouter(
    prefix="/friend",
    tags=["send-request"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]

class FriendRequestIn(BaseModel):
    sender_email: str
    receiver_username: str

@router.post("/send-request",status_code=status.HTTP_200_OK)
async def send_request(db : db_dependency,data: FriendRequestIn):
    sender = db.query(Users).filter(Users.email == data.sender_email).first()
    reciever = db.query(Users).filter(Users.username == data.receiver_username).first()
    if sender is None:
        raise HTTPException(status_code=404, detail="Sender not found")
    if reciever is None:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    friend_req = FriendRequest(
        sender_id = sender.id,
        reciever_id = reciever.id
    )
    db.add(friend_req)
    db.commit()
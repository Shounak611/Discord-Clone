from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from starlette import status
from models import Messages,Users
from sqlalchemy import or_
from datetime import datetime

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session,Depends(get_db)]

class MessageCreate(BaseModel):
    sender_email : str
    receiver_username : str
    content : str

@router.post("/send",status_code=status.HTTP_201_CREATED)
def send_message(msg: MessageCreate, db: db_dependency):
    sender = db.query(Users).filter(Users.email == msg.sender_email).first()
    if sender is None:
        raise HTTPException(status_code=404,detail="Sender not found")
    receiver = db.query(Users).filter(Users.username == msg.receiver_username).first()
    if receiver is None:
        raise HTTPException(status_code=404,detail="Receiver not found")
    new_msg = Messages(
        sender_id = sender.id,
        receiver_id = receiver.id,
        content = msg.content
    )
    db.add(new_msg)
    db.commit()
    return {"message":"Successfully send"}


@router.get("/get_msgs/{username}/{email}",status_code=status.HTTP_200_OK)
def get_conversation(username: str, email: str, db: db_dependency):
    sender = db.query(Users).filter(Users.email == email).first()
    if sender is None:
        raise HTTPException(status_code=404,detail="Sender not found")
    receiver = db.query(Users).filter(Users.username == username).first()
    if receiver is None:
        raise HTTPException(status_code=404,detail="Receiver not found")
    messages=[]
    messages = db.query(Messages).filter(
        ((Messages.sender_id == sender.id) & (Messages.receiver_id == receiver.id)) |
        ((Messages.sender_id == receiver.id) & (Messages.receiver_id == sender.id))
    ).order_by(Messages.timestamp).all()
    return messages
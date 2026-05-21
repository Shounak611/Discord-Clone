from fastapi import APIRouter, HTTPException, Query
from starlette import status
from app.models import Messages, Users
from sqlalchemy import or_
from datetime import datetime
from app.schemas import MessageCreate
from app.dependencies import db_dependency, current_user_dependency

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

@router.post("/send", status_code=status.HTTP_201_CREATED)
def send_message(msg: MessageCreate, db: db_dependency, current_user: current_user_dependency):
    if current_user.email != msg.sender_email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    sender = db.query(Users).filter(Users.email == msg.sender_email).first()
    if sender is None:
        raise HTTPException(status_code=404, detail="Sender not found")
    receiver = db.query(Users).filter(Users.username == msg.receiver_username).first()
    if receiver is None:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    new_msg = Messages(
        sender_id=sender.id,
        receiver_id=receiver.id,
        content=msg.content
    )
    db.add(new_msg)
    db.commit()
    return {"message": "Successfully send"}

@router.get("/get_msgs/{username}/{email}", status_code=status.HTTP_200_OK)
def get_conversation(username: str, email: str, db: db_dependency, current_user: current_user_dependency):
    if current_user.email != email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    sender = db.query(Users).filter(Users.email == email).first()
    if sender is None:
        raise HTTPException(status_code=404, detail="Sender not found")
    receiver = db.query(Users).filter(Users.username == username).first()
    if receiver is None:
        raise HTTPException(status_code=404, detail="Receiver not found")
        
    messages = db.query(Messages).filter(
        ((Messages.sender_id == sender.id) & (Messages.receiver_id == receiver.id)) |
        ((Messages.sender_id == receiver.id) & (Messages.receiver_id == sender.id))
    ).order_by(Messages.timestamp).all()
    return messages
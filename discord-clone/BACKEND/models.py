from database import Base
from sqlalchemy import Column, ForeignKey,Integer,String,Boolean,Date,DateTime,Text
from datetime import datetime,timezone
from sqlalchemy.orm import relationship

class Users(Base):
    __tablename__="users"

    id = Column(Integer,primary_key=True,index=True)
    email = Column(String,unique=True)
    display_name = Column(String)
    username = Column(String)
    hashed_password = Column(String)
    dob = Column(Date)

class FriendRequest(Base):
    __tablename__ = "friendrequest"

    id = Column(Integer,primary_key=True,index=True)
    sender_id = Column(Integer, nullable=False)
    receiver_id = Column(Integer, nullable=False)
    status = Column(Boolean,default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Message(Base):
    __tablename__ = 'messages'
    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    sender = relationship("Users", foreign_keys=[sender_id])
    receiver = relationship("Users", foreign_keys=[receiver_id])
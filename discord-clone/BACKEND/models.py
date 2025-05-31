from database import Base
from sqlalchemy import Column,Integer,String,Boolean,Date,DateTime
from datetime import datetime,timezone

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
    sender_id = Column(Integer)
    reciever_id = Column(Integer)
    status = Column(Boolean,default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
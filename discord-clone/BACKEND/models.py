from database import Base
from sqlalchemy import Column, ForeignKey,Integer,String,Boolean,Date,DateTime,Table
from datetime import datetime,timezone
from sqlalchemy.orm import relationship

class Server_members(Base):
    __tablename__="server_member"
    id = Column(Integer,primary_key=True,index=True)
    server_id = Column(Integer,nullable=False)
    user_id = Column(Integer,nullable=False)


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

class Messages(Base):
    __tablename__ = "messages"

    id = Column(Integer,index=True,primary_key=True)
    sender_id = Column(Integer,nullable=False)
    receiver_id = Column(Integer,nullable=False)
    content = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Server(Base):
    __tablename__ = "servers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey('users.id'))

class GroupMessage(Base):
    __tablename__ = "group_messages"
    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(String)
    channel_id = Column(String)
    sender = Column(String)
    type = Column(String) 
    content = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
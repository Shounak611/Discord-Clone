from database import Base
from sqlalchemy import Column,Integer,String,Boolean,ForeignKey,Date

class Users(Base):
    __tablename__="users"

    id = Column(Integer,primary_key=True,index=True)
    email = Column(String,unique=True)
    display_name = Column(String)
    username = Column(String)
    hashed_password = Column(String)
    dob = Column(Date)

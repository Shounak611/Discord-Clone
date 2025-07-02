from typing import List, Annotated
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import Server, Users, Server_members
from database import SessionLocal

router = APIRouter(
    prefix="/server",
    tags=["server"]
)


class CreateServerRequest(BaseModel):
    name: str
    owner_id: int  

class JoinServerRequest(BaseModel):
    server_name: str
    user_id: int

class ServerResponse(BaseModel):
    id: int
    name: str
    owner_id: int

    class Config:
        from_attributes = True

class RoleUpdateRequest(BaseModel):
    member_id : int
    new_role : str
    server_id : str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


@router.post("/create")
def create_server(data: CreateServerRequest, db: db_dependency):
    existing = db.query(Server).filter(Server.name == data.name, Server.owner_id == data.owner_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Server with this name already exists.")

    new_server = Server(name=data.name, owner_id=data.owner_id)
    db.add(new_server)
    db.commit()
    db.refresh(new_server)

    return {"message": "Server created", "server_id": new_server.id}


@router.post("/join")
def join_server(data: JoinServerRequest, db: db_dependency):
    server = db.query(Server).filter(Server.name == data.server_name).first()
    user = db.query(Users).filter(Users.id == data.user_id).first()

    if not server:
        raise HTTPException(status_code=404, detail="Server not found.")
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if  data.user_id == server.owner_id:
        raise HTTPException(status_code=400, detail="Owner cannot join their own server again.")
    already_member = db.query(Server_members).filter_by(server_id=server.id, user_id=data.user_id).first()
    if already_member:
        raise HTTPException(status_code=400, detail="User already in server.")

    new_join = Server_members(server_id=server.id, user_id=data.user_id)
    db.add(new_join)
    db.commit()

    return {"message": f"User {user.username} joined server {server.name}"}


@router.get("/get_servers/{user_id}", response_model=List[ServerResponse])
def get_servers(user_id: int, db: db_dependency):
    owned_servers = db.query(Server).filter(Server.owner_id == user_id).all()
    joined_ids = db.query(Server_members.server_id).filter(Server_members.user_id == user_id).all()

    joined_ids_set = {sid for (sid,) in joined_ids}
    owned_ids_set = {s.id for s in owned_servers}

    only_joined_ids = joined_ids_set - owned_ids_set

    joined_servers = db.query(Server).filter(Server.id.in_(only_joined_ids)).all()

    return owned_servers + joined_servers


@router.get("/get_members/{serverId}")
async def group_members(serverId : str,db : db_dependency):
    members = []
    server = db.query(Server).filter(Server.name == serverId).first()
    if server is None:
        raise HTTPException(status_code=404)
    server_members = db.query(Server_members).filter(Server_members.server_id == server.id).order_by(Server_members.role).all()
    for member in server_members:
        user = db.query(Users).filter(Users.id == member.user_id).first()
        if user is None:
            raise HTTPException(status_code=404,detail="user not found")
        members.append({"id":user.id,"username":user.username, "role":member.role})
    return members

@router.get("/get_owner/{serverId}")
async def get_owner(serverId : str,db : db_dependency):
    server = db.query(Server).filter(Server.name == serverId).first()
    if server is None:
        raise HTTPException(status_code=404)
    owner = db.query(Users).filter(Users.id == server.owner_id).first()
    return owner

def role(member,role):
    member.role = role

@router.put("/update_role")
def update_role(data: RoleUpdateRequest, db: Session = Depends(get_db)):
    member = db.query(Server_members).filter(Server_members.user_id == data.member_id, Server_members.server_id == data.server_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    role(member,data.new_role)
    db.commit()
    db.refresh(member)
    return {"role": member.role}

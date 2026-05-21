from pydantic import BaseModel

class CreateServerRequest(BaseModel):
    name: str
    owner_id: int  
    server_type: str

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

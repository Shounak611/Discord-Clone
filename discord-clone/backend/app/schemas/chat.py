from pydantic import BaseModel

class MessageCreate(BaseModel):
    sender_email : str
    receiver_username : str
    content : str

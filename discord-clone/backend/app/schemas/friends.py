from pydantic import BaseModel

class FriendRequestIn(BaseModel):
    sender_email: str
    receiver_username: str

class AcceptReject(BaseModel):
    sender_email : str
    receiver_email : str

from fastapi import APIRouter, HTTPException, Query
from starlette import status
from app.models import Users, FriendRequest
from sqlalchemy import or_
from app.schemas import FriendRequestIn, AcceptReject
from app.dependencies import db_dependency, current_user_dependency

router = APIRouter(
    prefix="/friend",
    tags=["friend"]
)

def check_same_user(sdr, rvr):
    if sdr.id == rvr.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can't send request to yourself")

@router.post("/send-request", status_code=status.HTTP_200_OK)
async def send_request(db: db_dependency, data: FriendRequestIn, current_user: current_user_dependency):
    if current_user.email != data.sender_email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    sender = db.query(Users).filter(Users.email == data.sender_email).first()
    receiver = db.query(Users).filter(Users.username == data.receiver_username).first()

    if sender is None:
        raise HTTPException(status_code=404, detail="Sender not found")
    if receiver is None:
        raise HTTPException(status_code=404, detail="Receiver not found")
    check_same_user(sender, receiver)
    
    existing = db.query(FriendRequest).filter(
        FriendRequest.sender_id == sender.id,
        FriendRequest.receiver_id == receiver.id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Friend request already sent")

    reverse_existing = db.query(FriendRequest).filter(
        FriendRequest.sender_id == receiver.id,
        FriendRequest.receiver_id == sender.id
    ).first()

    if reverse_existing:
        raise HTTPException(status_code=400, detail="Friend request already sent by this user to you")
    
    friend_req = FriendRequest(
        sender_id=sender.id,
        receiver_id=receiver.id
    )
    db.add(friend_req)
    db.commit()

@router.get("/pending-requests/{email}")
async def get_pending_requests(email: str, db: db_dependency, current_user: current_user_dependency):
    if current_user.email != email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    receiver = db.query(Users).filter(Users.email == email).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="User not found")
    
    requests = db.query(FriendRequest).filter(FriendRequest.receiver_id == receiver.id, FriendRequest.status == False).all()
    result = []
    for req in requests:
        snd = db.query(Users).filter(Users.id == req.sender_id).first()
        if snd is None:
            raise HTTPException(status_code=404, detail="User not found")
        result.append({
            "username": snd.username,
            "email": snd.email,
        })
    return result

def accepted(request):
    request.status = True

@router.put("/accept-request", status_code=status.HTTP_204_NO_CONTENT)
async def accept_req(db: db_dependency, data: AcceptReject, current_user: current_user_dependency):
    if current_user.email != data.receiver_email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    sender = db.query(Users).filter(Users.email == data.sender_email).first()
    receiver = db.query(Users).filter(Users.email == data.receiver_email).first()
    if sender is None:
        raise HTTPException(status_code=404, detail="Sender not found")
    if receiver is None:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    req = db.query(FriendRequest).filter(FriendRequest.sender_id == sender.id, FriendRequest.receiver_id == receiver.id).first()
    if req is None:
        raise HTTPException(status_code=404, detail="Request Not Found")
    accepted(req)
    db.commit()

@router.delete("/reject-request", status_code=status.HTTP_204_NO_CONTENT)
async def reject_req(db: db_dependency, data: AcceptReject, current_user: current_user_dependency):
    if current_user.email != data.receiver_email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    sender = db.query(Users).filter(Users.email == data.sender_email).first()
    receiver = db.query(Users).filter(Users.email == data.receiver_email).first()
    if sender is None:
        raise HTTPException(status_code=404, detail="Sender not found")
    if receiver is None:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    req = db.query(FriendRequest).filter(FriendRequest.sender_id == sender.id, FriendRequest.receiver_id == receiver.id).first()
    if req is None:
        raise HTTPException(status_code=404, detail="Request Not Found")
    db.delete(req)
    db.commit()

@router.get("/get-friends", status_code=200)
async def get_friends(db: db_dependency, email: str, current_user: current_user_dependency):
    if current_user.email != email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    user = db.query(Users).filter(Users.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User Not Found")
    
    friends_model = db.query(FriendRequest).filter(
        FriendRequest.sender_id == user.id,
        FriendRequest.status == True
    ).all()
    friends = []
    for friend in friends_model:
        frnd = db.query(Users).filter(Users.id == friend.receiver_id).first()
        if frnd is None:
            raise HTTPException(status_code=404, detail="User Not Found")
        friends.append(frnd.username)
        
    friends_model = db.query(FriendRequest).filter(
        FriendRequest.receiver_id == user.id,
        FriendRequest.status == True
    ).all()
    for friend in friends_model:
        frnd = db.query(Users).filter(Users.id == friend.sender_id).first()
        if frnd is None:
            raise HTTPException(status_code=404, detail="User Not Found")
        friends.append(frnd.username)
    return friends
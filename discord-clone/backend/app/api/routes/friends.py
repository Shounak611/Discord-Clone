from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect
from starlette import status
from app.models import Users, FriendRequest
from sqlalchemy import or_
from app.schemas import FriendRequestIn, AcceptReject
from app.dependencies import db_dependency, current_user_dependency, SECRET_KEY, ALGORITHM
from app.core.database import SessionLocal
import json
import jwt
from typing import Dict, List

router = APIRouter(
    prefix="/friend",
    tags=["friend"]
)

# Active connections for checking online status: username -> list of websockets
online_users: Dict[str, List[WebSocket]] = {}

async def broadcast_status_to_friends(db, username: str, status: str):
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return
    
    # Get all friends
    friends_model = db.query(FriendRequest).filter(
        ((FriendRequest.sender_id == user.id) | (FriendRequest.receiver_id == user.id)) &
        (FriendRequest.status == True)
    ).all()

    friend_ids = []
    for f in friends_model:
        friend_ids.append(f.receiver_id if f.sender_id == user.id else f.sender_id)

    if not friend_ids:
        return

    friend_users = db.query(Users).filter(Users.id.in_(friend_ids)).all()
    friend_usernames = [u.username for u in friend_users]

    # For each online friend, send them a status change message
    msg = json.dumps({
        "type": "status_change",
        "username": username,
        "status": status
    })

    for f_username in friend_usernames:
        if f_username in online_users:
            for conn in list(online_users[f_username]):
                try:
                    await conn.send_text(msg)
                except Exception:
                    pass


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
        friends.append({
            "username": frnd.username,
            "display_name": frnd.display_name,
            "status": "online" if frnd.username in online_users else "offline"
        })
        
    friends_model = db.query(FriendRequest).filter(
        FriendRequest.receiver_id == user.id,
        FriendRequest.status == True
    ).all()
    for friend in friends_model:
        frnd = db.query(Users).filter(Users.id == friend.sender_id).first()
        if frnd is None:
            raise HTTPException(status_code=404, detail="User Not Found")
        friends.append({
            "username": frnd.username,
            "display_name": frnd.display_name,
            "status": "online" if frnd.username in online_users else "offline"
        })
    return friends

@router.websocket("/ws")
async def status_websocket(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except Exception:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    db = SessionLocal()
    try:
        user = db.query(Users).filter(Users.email == email).first()
        if not user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        username = user.username
        await websocket.accept()

        if username not in online_users:
            online_users[username] = []
        online_users[username].append(websocket)

        # Notify friends that this user has come online
        await broadcast_status_to_friends(db, username, "online")

        try:
            while True:
                data_str = await websocket.receive_text()
                try:
                    data_json = json.loads(data_str)
                    msg_type = data_json.get("type")
                    if msg_type in ("rtc_signal", "call_signal"):
                        rvr_username = data_json.get("receiver_username")
                        if rvr_username and rvr_username in online_users:
                            forward_data = {
                                "type": msg_type,
                                "sender_username": username,
                            }
                            if msg_type == "rtc_signal":
                                forward_data["signal"] = data_json.get("signal")
                            else:
                                forward_data["content"] = data_json.get("content")
                                from datetime import datetime
                                forward_data["timestamp"] = datetime.utcnow().isoformat()
                            
                            forward_msg = json.dumps(forward_data)
                            for conn in list(online_users[rvr_username]):
                                try:
                                    await conn.send_text(forward_msg)
                                except Exception:
                                    pass
                except Exception:
                    pass
        except WebSocketDisconnect:
            if username in online_users:
                if websocket in online_users[username]:
                    online_users[username].remove(websocket)
                if not online_users[username]:
                    del online_users[username]
                    # Notify friends that this user has gone offline
                    await broadcast_status_to_friends(db, username, "offline")
    finally:
        db.close()
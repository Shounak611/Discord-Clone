from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect
from starlette import status
from app.models import Messages, Users
from app.schemas import MessageCreate
from app.dependencies import db_dependency, current_user_dependency, SECRET_KEY, ALGORITHM
from app.core.database import SessionLocal
import jwt
import json
import asyncio
from typing import Dict, List

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

# Active WebSocket connections for Direct Messages
dm_connections: Dict[str, List[WebSocket]] = {}

def get_dm_key(user1_id: int, user2_id: int) -> str:
    return f"dm_{min(user1_id, user2_id)}_{max(user1_id, user2_id)}"

async def broadcast_dm(key: str, data: dict):
    if key in dm_connections:
        for conn in list(dm_connections[key]):
            try:
                await conn.send_json(data)
            except Exception:
                pass

@router.post("/send", status_code=status.HTTP_201_CREATED)
def send_message(msg: MessageCreate, db: db_dependency, current_user: current_user_dependency):
    if current_user.email != msg.sender_email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    sender = db.query(Users).filter(Users.email == msg.sender_email).first()
    if sender is None:
        raise HTTPException(status_code=404, detail="Sender not found")
    receiver = db.query(Users).filter(Users.username == msg.receiver_username).first()
    if receiver is None:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    new_msg = Messages(
        sender_id=sender.id,
        receiver_id=receiver.id,
        content=msg.content
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    # Broadcast to websocket connections if active
    key = get_dm_key(sender.id, receiver.id)
    broadcast_data = {
        "id": new_msg.id,
        "sender_id": new_msg.sender_id,
        "receiver_id": new_msg.receiver_id,
        "content": new_msg.content,
        "timestamp": new_msg.timestamp.isoformat() if new_msg.timestamp else None
    }
    
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(broadcast_dm(key, broadcast_data))
    except RuntimeError:
        # Fallback if no running event loop
        asyncio.run(broadcast_dm(key, broadcast_data))

    return {"message": "Successfully send"}

@router.get("/get_msgs/{username}/{email}", status_code=status.HTTP_200_OK)
def get_conversation(username: str, email: str, db: db_dependency, current_user: current_user_dependency):
    if current_user.email != email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    sender = db.query(Users).filter(Users.email == email).first()
    if sender is None:
        raise HTTPException(status_code=404, detail="Sender not found")
    receiver = db.query(Users).filter(Users.username == username).first()
    if receiver is None:
        raise HTTPException(status_code=404, detail="Receiver not found")
        
    messages = db.query(Messages).filter(
        ((Messages.sender_id == sender.id) & (Messages.receiver_id == receiver.id)) |
        ((Messages.sender_id == receiver.id) & (Messages.receiver_id == sender.id))
    ).order_by(Messages.timestamp).all()
    return messages

@router.websocket("/ws/{receiver_username}")
async def websocket_endpoint(websocket: WebSocket, receiver_username: str):
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
        sender = db.query(Users).filter(Users.email == email).first()
        receiver = db.query(Users).filter(Users.username == receiver_username).first()
        if not sender or not receiver:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        await websocket.accept()
        key = get_dm_key(sender.id, receiver.id)

        if key not in dm_connections:
            dm_connections[key] = []
        dm_connections[key].append(websocket)

        try:
            while True:
                data_str = await websocket.receive_text()
                data_json = json.loads(data_str)
                
                # Check for WebRTC signaling messages
                if data_json.get("type") == "rtc_signal":
                    broadcast_data = {
                        "type": "rtc_signal",
                        "sender_id": sender.id,
                        "receiver_id": receiver.id,
                        "signal": data_json.get("signal")
                    }
                    await broadcast_dm(key, broadcast_data)
                    continue

                content = data_json.get("content")

                if content:
                    new_msg = Messages(
                        sender_id=sender.id,
                        receiver_id=receiver.id,
                        content=content
                    )
                    db.add(new_msg)
                    db.commit()
                    db.refresh(new_msg)

                    broadcast_data = {
                        "id": new_msg.id,
                        "sender_id": new_msg.sender_id,
                        "receiver_id": new_msg.receiver_id,
                        "content": new_msg.content,
                        "timestamp": new_msg.timestamp.isoformat() if new_msg.timestamp else None
                    }

                    await broadcast_dm(key, broadcast_data)
        except WebSocketDisconnect:
            if websocket in dm_connections[key]:
                dm_connections[key].remove(websocket)
            if not dm_connections[key]:
                del dm_connections[key]
    finally:
        db.close()
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, status
from typing import Dict, List
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import GroupMessage  
import json
from app.dependencies import db_dependency, current_user_dependency, SECRET_KEY, ALGORITHM
import jwt

router = APIRouter(prefix="/ws", tags=["ws"])

active_connections: Dict[str, List[WebSocket]] = {}

def get_channel_key(server_id: str, channel_id: str) -> str:
    return f"{server_id}:{channel_id}"

def save_message_to_db(server_id: str, channel_id: str, sender: str, type_: str, content: str):
    db: Session = SessionLocal()
    msg = GroupMessage(
        server_id=server_id,
        channel_id=channel_id,
        sender=sender,
        type=type_,
        content=content
    )
    db.add(msg)
    db.commit()
    db.close()

@router.websocket("/chat/{server_id}/{channel_id}")
async def websocket_endpoint(websocket: WebSocket, server_id: str, channel_id: str):
    token = websocket.query_params.get("token")
    if not token:
        # Reject connection if token is missing
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        # Reject connection if token is invalid/expired
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await websocket.accept()
    key = get_channel_key(server_id, channel_id)

    if key not in active_connections:
        active_connections[key] = []
    active_connections[key].append(websocket)

    try:
        while True:
            data = await websocket.receive_text()

            message = json.loads(data)
            sender = message.get("sender")
            type_ = message.get("type")
            content = message.get("content")

            save_message_to_db(server_id, channel_id, sender, type_, content)

            for conn in active_connections[key]:
                await conn.send_text(data)

    except WebSocketDisconnect:
        active_connections[key].remove(websocket)
        if not active_connections[key]:
            del active_connections[key]

@router.get("/{server_id}/{channel_id}/messages")
def get_messages(server_id: str, channel_id: str, db: db_dependency, current_user: current_user_dependency):
    messages = db.query(GroupMessage)\
        .filter_by(server_id=server_id, channel_id=channel_id)\
        .order_by(GroupMessage.id)\
        .all()
    
    return [
        {
            "sender": msg.sender,
            "type": msg.type,
            "content": msg.content
        } for msg in messages
    ]
from fastapi import WebSocket
from typing import Dict, List

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, channel_key: str):
        await websocket.accept()
        if channel_key not in self.active_connections:
            self.active_connections[channel_key] = []
        self.active_connections[channel_key].append(websocket)

    def disconnect(self, websocket: WebSocket, channel_key: str):
        if channel_key in self.active_connections:
            self.active_connections[channel_key].remove(websocket)
            if not self.active_connections[channel_key]:
                del self.active_connections[channel_key]

    async def broadcast(self, message: str, channel_key: str):
        if channel_key in self.active_connections:
            for connection in self.active_connections[channel_key]:
                await connection.send_text(message)

manager = ConnectionManager()

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

import models
from database import engine

from routers import register, login, friends, getUser, chat, server,channel, upload

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB setup
models.Base.metadata.create_all(bind=engine)

# Routers
app.include_router(register.router)
app.include_router(login.router)
app.include_router(getUser.router)
app.include_router(friends.router)
app.include_router(chat.router)
app.include_router(server.router)
app.include_router(channel.router)   
app.include_router(upload.router)   

# Static file serving for uploaded files
app.mount("/uploaded_files", StaticFiles(directory="uploaded_files"), name="uploaded_files")

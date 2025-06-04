from fastapi import FastAPI
import models, register, login, friends, getUser, google_auth
from database import engine
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


models.Base.metadata.create_all(bind=engine)

app.include_router(register.router)
app.include_router(login.router)
app.include_router(getUser.router)
app.include_router(friends.router)

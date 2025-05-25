from fastapi import FastAPI
import models,register,login
from database import engine


app= FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(register.router)
app.include_router(login.router)
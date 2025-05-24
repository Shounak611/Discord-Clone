from fastapi import FastAPI
import models,register
from database import engine


app= FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(register.router)
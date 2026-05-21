from fastapi import APIRouter, HTTPException
from starlette import status
from app.models import Users
from passlib.context import CryptContext
from app.schemas import LoginRequest
from app.dependencies import db_dependency, create_access_token

router = APIRouter(
    prefix="/login",
    tags=["login"]
)

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def check_user(request, model):
    if not bcrypt_context.verify(request.password, model.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="INVALID USER")
    return True

@router.post("/", status_code=status.HTTP_200_OK)
async def get_page(db: db_dependency, req: LoginRequest):
    user_model = db.query(Users).filter(Users.email == req.email).first()
    if user_model is None:
        raise HTTPException(status_code=404, detail="USER NOT FOUND")
    res = check_user(req, user_model)
    if res:
        token = create_access_token(data={"sub": user_model.email})
        return {"message": "WELCOME USER", "token": token}
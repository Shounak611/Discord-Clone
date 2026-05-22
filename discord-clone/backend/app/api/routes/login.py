from fastapi import APIRouter, HTTPException
from starlette import status
from app.models import Users
from passlib.context import CryptContext
from app.schemas import LoginRequest, GoogleLoginRequest
from app.dependencies import db_dependency, create_access_token
import urllib.request
import json

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

@router.post("/google", status_code=status.HTTP_200_OK)
async def google_login(db: db_dependency, req: GoogleLoginRequest):
    try:
        url = "https://www.googleapis.com/oauth2/v3/userinfo"
        headers = {"Authorization": f"Bearer {req.access_token}"}
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request) as response:
            user_info = json.loads(response.read().decode())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google access token: {str(e)}"
        )
    
    email = user_info.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account does not provide an email address"
        )
    
    user_model = db.query(Users).filter(Users.email == email).first()
    
    if user_model is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="USER NOT FOUND(Seems email not registered yet!)"
        )
        
    token = create_access_token(data={"sub": user_model.email})
    return {"message": "WELCOME USER", "token": token, "email": user_model.email}
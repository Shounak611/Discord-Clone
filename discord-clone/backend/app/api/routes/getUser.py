from fastapi import APIRouter, HTTPException, Query, status
from app.models import Users
from app.dependencies import db_dependency, current_user_dependency

router = APIRouter(
    prefix="/get_user",
    tags=["get_user"]
)

@router.get("/", status_code=status.HTTP_200_OK)
async def search_user(db: db_dependency, current_user: current_user_dependency, email: str = Query(..., min_length=3)):
    if current_user.email != email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    user_model = db.query(Users).filter(Users.email == email).first()
    if user_model is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return user_model
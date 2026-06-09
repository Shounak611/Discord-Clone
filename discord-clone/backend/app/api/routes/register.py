from fastapi import APIRouter, HTTPException
from starlette import status
from app.models import Users
from app.schemas import Register_request, GoogleLoginRequest
from app.dependencies import db_dependency, create_access_token
from datetime import date
import urllib.request
import json
import hashlib
import bcrypt

router = APIRouter(
    prefix="/register",
    tags=["register"]
)

# passlib.context has been replaced with direct bcrypt usage

@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(db: db_dependency):
    return db.query(Users).all()

@router.post("/registration", status_code=status.HTTP_201_CREATED)
async def registration(db: db_dependency, reg_req: Register_request):
    try:
        existing_user = db.query(Users).filter(Users.email == reg_req.email.strip()).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        
        if not reg_req.display_name.strip() or not reg_req.username.strip():
            raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="Invalid username or display name")
        
        prehashed = hashlib.sha256(reg_req.password.encode("utf-8")).hexdigest()
        hashed_bytes = bcrypt.hashpw(prehashed.encode("utf-8"), bcrypt.gensalt())
        new_user = Users(
            email=reg_req.email.strip(),
            display_name=reg_req.display_name.strip(),
            username=reg_req.username.strip(),
            hashed_password=hashed_bytes.decode("utf-8"),
            dob=reg_req.dob,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        token = create_access_token(data={"sub": new_user.email})
        return {"message": "Registration successful", "token": token}
    
    except Exception as e:
        # This will catch the crash and send the exact error to your frontend Network tab!
        print(f"CRASH ERROR: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Server Crash: {str(e)}")
@router.post("/google", status_code=status.HTTP_201_CREATED)
async def google_registration(db: db_dependency, req: GoogleLoginRequest):
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
        
    existing_user = db.query(Users).filter(Users.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    display_name = user_info.get("name", user_info.get("given_name", email.split("@")[0]))
    username = user_info.get("preferred_username", email.split("@")[0])
    
    original_username = username
    counter = 1
    while db.query(Users).filter(Users.username == username).first() is not None:
        username = f"{original_username}{counter}"
        counter += 1
        
    # Try to fetch birthday from Google People API
    dob_val = None
    try:
        birthday_url = "https://people.googleapis.com/v1/people/me?personFields=birthdays"
        birthday_headers = {"Authorization": f"Bearer {req.access_token}"}
        birthday_request = urllib.request.Request(birthday_url, headers=birthday_headers)
        with urllib.request.urlopen(birthday_request) as b_response:
            birthday_info = json.loads(b_response.read().decode())
        
        birthdays = birthday_info.get("birthdays", [])
        for b in birthdays:
            date_data = b.get("date")
            if date_data:
                year = date_data.get("year")
                month = date_data.get("month")
                day = date_data.get("day")
                if month and day:
                    dob_val = date(year or 2000, month, day)
                    break
    except Exception as e:
        # Fallback to None if the API request fails (e.g., missing scopes or privacy settings)
        dob_val = None

    import secrets
    random_password = secrets.token_urlsafe(32)
    prehashed = hashlib.sha256(random_password.encode("utf-8")).hexdigest()
    hashed_bytes = bcrypt.hashpw(prehashed.encode("utf-8"), bcrypt.gensalt())
    new_user = Users(
        email=email,
        display_name=display_name,
        username=username,
        hashed_password=hashed_bytes.decode("utf-8"),
        dob=dob_val
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token(data={"sub": new_user.email})
    return {"message": "Registration successful", "token": token, "email": new_user.email}
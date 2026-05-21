from datetime import date
from pydantic import BaseModel, EmailStr, field_validator
import re

class Register_request(BaseModel):
    email : EmailStr
    display_name : str
    username : str
    password : str
    dob : date

    @field_validator("password")
    def validate_strong_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', v):
            raise ValueError("Password must include at least one uppercase letter.")
        if not re.search(r'[a-z]', v):
            raise ValueError("Password must include at least one lowercase letter.")
        if not re.search(r'\d', v):
            raise ValueError("Password must include at least one digit.")
        if not re.search(r'[@$!%*?&]', v):
            raise ValueError("Password must include at least one special character (@$!%*?&).")
        return v

class LoginRequest(BaseModel):
    email : EmailStr
    password : str

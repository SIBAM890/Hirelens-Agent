from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str # HR or CANDIDATE

class UserLogin(BaseModel):
    email: EmailStr
    password: str
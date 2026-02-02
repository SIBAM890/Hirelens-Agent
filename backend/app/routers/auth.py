from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import users
from app.schemas import auth_schemas
from passlib.context import CryptContext

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password Hashing
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/register", response_model=dict)
def register(user: auth_schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    db_user = db.query(users.User).filter(users.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    new_user = users.User(
        email=user.email,
        password_hash=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"status": "success", "token": str(new_user.id), "user_id": new_user.id, "email": new_user.email}

@router.post("/login")
def login(user_data: auth_schemas.UserLogin, db: Session = Depends(get_db)):
    print(f"DEBUG: Login attempt for email: '{user_data.email}'")
    user = db.query(users.User).filter(users.User.email == user_data.email).first()
    
    if not user:
        print("DEBUG: User NOT found in DB.")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    print(f"DEBUG: Verifying password. Hash length: {len(user.password_hash)}")
    if not verify_password(user_data.password, user.password_hash):
        print(f"DEBUG: Password verification FAILED. Stored hash starts with: {user.password_hash[:10]}...")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    print("DEBUG: Password verified. Login successful.")
    
    # In a real app, return a JWT Token here. 
    # For this project, we return the user_id as a dummy token.
    return {"status": "success", "token": str(user.id), "user_id": user.id, "role": user.role}
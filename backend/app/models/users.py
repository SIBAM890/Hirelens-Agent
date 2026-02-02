from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)  # "HR" or "CANDIDATE"
    
    # Relationships
    jobs_posted = relationship("Job", back_populates="recruiter")
    assessments = relationship("Assessment", back_populates="candidate")
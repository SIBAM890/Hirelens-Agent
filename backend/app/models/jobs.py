from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(Text)
    experience_level = Column(String) # "Junior", "Mid", "Senior"
    pass_marks = Column(Integer, default=60) # Overall passing criteria
    created_at = Column(DateTime, default=datetime.utcnow)

    # --- NEW FIELDS ---
    # 1. Job Overview
    company_name = Column(String, default="TechCorp Inc.")
    location = Column(String, default="Remote") # Remote, Hybrid, On-site
    job_type = Column(String, default="Full-time") # Full-time, Contract, etc.
    salary_range = Column(String, nullable=True) # e.g. "10LPA - 20LPA"
    deadline = Column(String, nullable=True)
    joining_date = Column(String, nullable=True)

    # 2. Detailed JD
    role_summary = Column(Text, nullable=True)
    responsibilities = Column(Text, nullable=True) # Stored as rich text or JSON string
    required_skills = Column(String, nullable=True) # Comma separated
    tools_tech = Column(String, nullable=True) # Comma separated

    # 3. Company Info
    company_about = Column(Text, nullable=True)
    company_mission = Column(Text, nullable=True)
    perks_benefits = Column(Text, nullable=True)

    # 4. Selection Process
    hiring_process = Column(Text, nullable=True) # JSON string or specific steps text

    # 5. Contact Info
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    website = Column(String, nullable=True)

    # Relationships
    recruiter = relationship("User", back_populates="jobs_posted")
    questions = relationship("Question", back_populates="job")
    assessments = relationship("Assessment", back_populates="job")


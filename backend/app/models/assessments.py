from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("users.id"))
    
    current_stage = Column(String, default="GATE_1") # GATE_1, GATE_2, ...
    
    # Gate 1: Quiz
    quiz_score = Column(Float, default=0.0)
    quiz_status = Column(String, default="PENDING")
    
    # Gate 2: Code
    coding_challenge_score = Column(Float, default=0.0)
    coding_status = Column(String, default="PENDING")
    
    # Gate 3 & 4: Interview
    tech_interview_score = Column(Float, default=0.0)
    hr_interview_score = Column(Float, default=0.0)
    
    # Gate 5: Final
    profile_score = Column(Float, default=0.0)
    final_verdict = Column(String, default="PENDING") # HIRE, REJECT, REVIEW

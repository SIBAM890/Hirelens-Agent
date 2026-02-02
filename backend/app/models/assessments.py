from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)

    # CURRENT STAGE TRACKER
    # GATE_1 → GATE_5 → COMPLETED / REJECTED
    current_stage = Column(String, default="GATE_1")

    # --- GATE 1: PROCTORED QUIZ ---
    quiz_score = Column(Float, default=0.0)
    quiz_status = Column(String, default="PENDING")

    # --- GATE 2: CODING ---
    leetcode_score = Column(Float, default=0.0)
    coding_challenge_score = Column(Float, default=0.0)
    coding_status = Column(String, default="PENDING")

    # --- GATE 3: TECH INTERVIEW ---
    tech_interview_score = Column(Float, default=0.0)
    tech_interview_feedback = Column(Text)
    tech_status = Column(String, default="PENDING")

    # --- GATE 4: HR INTERVIEW ---
    hr_interview_score = Column(Float, default=0.0)
    hr_interview_feedback = Column(Text)
    hr_status = Column(String, default="PENDING")

    # --- GATE 5: PROFILE ANALYSIS ---
    profile_score = Column(Float, default=0.0)

    # FINAL DECISION
    final_verdict = Column(String, default="PENDING")  # HIRE / NO_HIRE / REVIEW

    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    candidate = relationship("User", back_populates="assessments")
    job = relationship("Job", back_populates="assessments")

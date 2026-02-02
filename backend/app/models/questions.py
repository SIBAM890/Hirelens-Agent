from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Question(Base):
    __tablename__ = "questions"
    __table_args__ = {'extend_existing': True}  # Allow redefining the table

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    text = Column(Text)
    category = Column(String) # "GATE_1_QUIZ", "GATE_3_TECH", "GATE_4_HR"
    correct_answer = Column(Text, nullable=True) # Only for Gate 1 MCQs
    options = Column(Text, nullable=True) # JSON string of options for MCQs

    # Relationship
    job = relationship("Job", back_populates="questions")
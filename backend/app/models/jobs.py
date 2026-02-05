from sqlalchemy import Column, Integer, String, Text, Float
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    requirements = Column(Text)
    pass_marks = Column(Float)
    status = Column(String, default="OPEN")

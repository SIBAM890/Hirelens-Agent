from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    title: str
    description: str
    pass_marks: float

class JobResponse(JobCreate):
    id: int
    class Config:
        from_attributes = True

class CodeSubmission(BaseModel):
    code: str
    language: str

from pydantic import BaseModel
from typing import Optional, List

# What the Frontend sends to the AI
class ChatRequest(BaseModel):
    message: str
    interview_type: str = "TECHNICAL"  # Options: "TECHNICAL" or "HR"
    application_id: Optional[int] = None

# What the AI replies with
class ChatResponse(BaseModel):
    agent_message: str

# For saving the final result of the interview
class InterviewResult(BaseModel):
    application_id: int
    score: float
    feedback: str
    interview_type: str
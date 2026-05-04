from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel, Field
from app.services.email_service import send_cheat_alert
import datetime
from app.routers.auth import get_current_user

router = APIRouter(prefix="/proctor", tags=["Proctoring"])

class ViolationReport(BaseModel):
    candidate_id: str
    job_id: str
    violation_type: str # e.g., "Face Not Detected", "Multiple Faces", "Tab Switch"
    # Fix: Use default_factory to evaluate timestamp per-request
    timestamp: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())

import logging

# Configure logger
logger = logging.getLogger(__name__)

@router.post("/alert")
async def report_violation(
    report: ViolationReport, 
    background_tasks: BackgroundTasks,
    # Fix: Add authentication to protect sensitive endpoint
    current_user: dict = Depends(get_current_user) 
):
    # current_user is a Pydantic model, so we access attributes directly
    username = getattr(current_user, 'username', 'Unknown')
    logger.info(f"[PROCTOR] Violation received from {username}: {report}")
    
    # Logic to trigger email alert
    # We use background tasks so the API returns quickly to the frontend
    # For now, hardcoded HR email, in real app fetch from Job
    hr_email = "hr@company.com" 
    candidate_email = f"candidate_{report.candidate_id}@example.com" # Mock
    
    background_tasks.add_task(
        send_cheat_alert, 
        candidate_email, 
        hr_email, 
        report.violation_type
    )
    
    return {"status": "logged", "message": "Violation reported"}

class FrameData(BaseModel):
    image_base64: str

import google.generativeai as genai
import os

@router.post("/analyze")
async def analyze_frame(
    frame: FrameData,
    current_user: dict = Depends(get_current_user)
):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY missing")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = "You are an AI exam proctor. Analyze this webcam image. Rules: 1. There must be EXACTLY ONE person. 2. The person must be looking generally towards the screen. 3. No phones or other people allowed. If the person is missing, reply EXACTLY with 'No Face Detected'. If multiple people, reply 'Multiple Faces Detected'. If looking at phone, reply 'Phone Detected'. If looking far away, reply 'Looking Away'. If everything is normal, reply EXACTLY with 'OK'. Reply with NOTHING ELSE."
    
    try:
        response = model.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": frame.image_base64}
        ])
        
        result = response.text.strip().replace('\n', '')
        if result == 'OK':
            return {"status": "OK"}
        else:
            # If it gave a long explanation instead of just the keywords, return the first 40 chars
            return {"status": "VIOLATION", "reason": result[:40] + ("..." if len(result) > 40 else "")}
    except Exception as e:
        logger.error(f"Gemini Vision API error: {e}")
        return {"status": "VIOLATION", "reason": "Backend AI Error"}

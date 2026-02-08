from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel, Field
from app.services.email_service import send_cheat_alert
import datetime
from app.routers .auth import get_current_user # Assuming auth module exists based on other files

router = APIRouter(prefix="/proctor", tags=["Proctoring"])

class ViolationReport(BaseModel):
    candidate_id: str
    job_id: str
    violation_type: str # e.g., "Face Not Detected", "Multiple Faces", "Tab Switch"
    # Fix: Use default_factory to evaluate timestamp per-request
    timestamp: str = Field(default_factory=lambda: datetime.datetime.now().isoformat())

@router.post("/alert")
async def report_violation(
    report: ViolationReport, 
    background_tasks: BackgroundTasks,
    # Fix: Add authentication to protect sensitive endpoint
    current_user: dict = Depends(get_current_user) 
):
    print(f"[PROCTOR] Violation received from {current_user.get('username', 'Unknown')}: {report}")
    
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

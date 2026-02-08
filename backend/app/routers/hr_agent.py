from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.jobs import Job
from app.models.assessments import Assessment
from app.models.users import User
from app.schemas.job_schemas import JobCreate
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/hr", tags=["HR Agent"])

# --- Schemas ---
class JobResponse(BaseModel):
    id: int
    title: str
    description: str
    pass_marks: int
    
    class Config:
        orm_mode = True

class CandidateStatusUpdate(BaseModel):
    status: str

# --- Endpoints ---

@router.post("/create-job")
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    # In a real app, we'd get the current HR user ID here
    new_job = Job(
        title=job.title,
        description=job.description,
        pass_marks=job.pass_marks,
        # hr_id=1 # hardcoded for now or get from auth
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_applicants = db.query(Assessment).count()
    active_jobs = db.query(Job).count()
    # Mock data for charts - in real app, aggregate by date
    chart_data = [
        {"name": "Mon", "applicants": 12, "hired": 4},
        {"name": "Tue", "applicants": 19, "hired": 8},
        {"name": "Wed", "applicants": 3, "hired": 1},
        {"name": "Thu", "applicants": 5, "hired": 2},
        {"name": "Fri", "applicants": 2, "hired": 0},
    ]
    return {
        "stats": {
            "total_applicants": total_applicants,
            "active_jobs": active_jobs,
            "interviews_today": 5, # Mock
            "hires_made": 12 # Mock
        },
        "chart_data": chart_data
    }

@router.get("/jobs")
def get_hr_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()

@router.get("/candidates")
def get_candidates(db: Session = Depends(get_db)):
    # Join with User and Job to get names
    results = db.query(Assessment, User.username, Job.title).join(User, Assessment.candidate_id == User.id).join(Job, Assessment.job_id == Job.id).all()
    
    candidates = []
    for assessment, username, job_title in results:
        candidates.append({
            "id": assessment.id,
            "name": username,
            "role": job_title,
            "score": assessment.trust_score,
            "status": assessment.status,
            "date": "Today" # Mock date
        })
    return candidates

@router.put("/candidates/{id}/status")
def update_candidate_status(id: int, update: CandidateStatusUpdate, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == id).first()
    if not assessment:
        raise HTTPException(status_code= 404, detail="Candidate not found")
    
    assessment.status = update.status
    db.commit()
    return {"message": "Status updated"}

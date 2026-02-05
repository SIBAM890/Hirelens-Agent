from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.jobs import Job
from app.models.assessments import Assessment
from app.schemas.job_schemas import JobCreate

router = APIRouter(prefix="/hr", tags=["HR Agent"])

@router.post("/create-job")
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    new_job = Job(
        title=job.title,
        description=job.description,
        pass_marks=job.pass_marks
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.get("/candidates")
def get_candidates(db: Session = Depends(get_db)):
    # Return all assessments
    return db.query(Assessment).all()

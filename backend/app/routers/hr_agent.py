from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.jobs import Job
from app.models.assessments import Assessment
from app.models.users import User
from app.schemas.job_schemas import JobCreate
import google.generativeai as genai
import os
import json
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

# Validate API Key at startup
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY not set. AI features will fail.")
else:
    genai.configure(api_key=api_key)

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

class JobRequirementRequest(BaseModel):
    text: str

# --- Endpoints ---

@router.post("/create-job")
def create_job(
    title: str = Form(...),
    description: str = Form(...),
    pass_marks: int = Form(...),
    knowledge_base: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Process file upload (mock)
    if knowledge_base:
        _ = knowledge_base.file.read() # Consume file to acknowledge processing
    
    new_job = Job(
        title=title,
        description=description,
        pass_marks=pass_marks,
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



@router.post("/parse-job-requirements")
async def parse_job_requirements(request: JobRequirementRequest):
    try:
        if not os.getenv("GEMINI_API_KEY"):
             raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not set in environment variables")
             
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""
        You are an expert HR assistant. Extract job details from the following text and return a JSON object that matches our form structure.
        
        TEXT: "{request.text}"
        
        REQUIRED JSON STRUCTURE:
        {{
            "title": "string",
            "company_name": "string (default: TechCorp)",
            "location": "string (default: Remote)",
            "job_type": "string (Full-time, Part-time, Contract, Internship)",
            "salary_range": "string",
            "experience_level": "string",
            "role_summary": "string (brief overview)",
            "responsibilities": "string (bullet points)",
            "required_skills": "string (comma separated)",
            "tools_tech": "string (comma separated)",
            "company_about": "string",
            "company_mission": "string",
            "perks_benefits": "string",
            "hiring_process": "string"
        }}
        
        IMPORTANT: Return ONLY the raw JSON object. Do not include markdown formatting (```json ... ```).
        """
        
        response = model.generate_content(prompt)
        
        # Robust cleanup
        cleaned_text = response.text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
        cleaned_text = cleaned_text.strip()
        
        data = json.loads(cleaned_text)
        return data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error parsing job: {e}")
        # Return generic error to client, log specific error
        raise HTTPException(status_code=500, detail="Failed to parse job requirements. Please ensure the text is valid.")

@router.get("/jobs/{job_id}")
def get_job_details(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/jobs/{job_id}")
def update_job(
    job_id: int,
    title: str = Form(None),
    description: str = Form(None),
    pass_marks: int = Form(None),
    knowledge_base: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if title:
        job.title = title
    if description:
        job.description = description
    if pass_marks is not None:
        job.pass_marks = pass_marks
    
    # Handle file update
    if knowledge_base:
        # Mock processing: Read file size to validate functionality
        file_content = knowledge_base.file.read()
        print(f"Processed knowledge base update: {len(file_content)} bytes")
        # In a real app: save file, get URL, update job.knowledge_base_url
        
    db.commit()
    db.refresh(job)
    return job

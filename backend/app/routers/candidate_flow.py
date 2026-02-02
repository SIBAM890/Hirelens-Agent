from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.code_compiler import ai_compile_code
from app.services.interview_bot import get_ai_response
from app.services.profile_scorer import analyze_profile
from app.services.pdf_parser import extract_text_from_pdf
from app.schemas import job_schemas

from app.models.assessments import Assessment
from app.models.jobs import Job
from app.models.users import User

import json

router = APIRouter(prefix="/candidate", tags=["Candidate Flow"])

# --- GET JOBS ---
@router.get("/jobs")
def get_open_jobs(db: Session = Depends(get_db)):
    # Return all jobs
    jobs_list = db.query(Job).all()
    # Serialize manually or use Pydantic schema
    return [
        {
            "id": job.id, 
            "title": job.title, 
            "description": job.description, 
            "pass_marks": job.pass_marks,
            # Add dummy skills for UI since we don't store them yet
            "skills": ["Python", "FastAPI", "React"] if "Python" in job.title else ["General", "Problem Solving"]
        } 
        for job in jobs_list
    ]

# --- START: CREATE APPLICATION ---
@router.post("/apply/{job_id}")
def start_application(job_id: int, candidate_id: int, db: Session = Depends(get_db)):
    # Check if already applied
    existing = db.query(Assessment).filter(
        Assessment.job_id == job_id,
        Assessment.candidate_id == candidate_id
    ).first()
    
    if existing:
        return {"message": "Application already exists", "application_id": existing.id}

    new_app = Assessment(
        job_id=job_id,
        candidate_id=candidate_id,
        current_stage="GATE_1", # Start at the Quiz
        quiz_status="PENDING"
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    
    return {"message": "Application Started", "application_id": new_app.id, "stage": "GATE_1"}

# --- GATE 1: QUIZ ---
@router.post("/submit-quiz/{application_id}")
def submit_quiz(application_id: int, score: float, db: Session = Depends(get_db)):
    app = db.query(Assessment).filter(Assessment.id == application_id).first()
    if not app: raise HTTPException(status_code=404, detail="App not found")
    
    app.quiz_score = score
    if score >= 15: 
        app.quiz_status = "PASS"
        app.current_stage = "GATE_2"
    else:
        app.quiz_status = "FAIL"
        app.current_stage = "REJECTED"
    
    db.commit()
    return {"status": app.quiz_status, "next_stage": app.current_stage}

# --- GATE 2: CODING ---
@router.post("/submit-code/{application_id}")
def submit_code(application_id: int, submission: job_schemas.CodeSubmission, db: Session = Depends(get_db)):
    # 1. Run AI Compiler
    problem = "Write a function to reverse a string." # Fetch real problem in prod
    ai_result = ai_compile_code(problem, submission.code, submission.language)
    result_json = json.loads(ai_result)
    
    # 2. Update DB
    app = db.query(Assessment).filter(Assessment.id == application_id).first()
    score = result_json.get("score", 0)
    
    app.coding_challenge_score = score
    if score >= 10:
        app.coding_status = "PASS"
        app.current_stage = "GATE_3"
    else:
        app.coding_status = "FAIL"
        app.current_stage = "REJECTED"
        
    db.commit()
    return result_json

# --- GATE 3 & 4: INTERVIEW BOT ---
@router.post("/chat-response")
def chat_with_agent(message: str, interview_type: str):
    return {"agent_message": get_ai_response([], message, interview_type)}

# --- GATE 5: FINAL PROFILE ANALYSIS ---
@router.post("/finalize-profile/{application_id}")
async def finalize_profile(application_id: int, resume: UploadFile = File(...), db: Session = Depends(get_db)):
    app = db.query(Assessment).filter(Assessment.id == application_id).first()
    job = db.query(Job).filter(Job.id == app.job_id).first()
    
    # 1. Extract Resume Text
    resume_text = await extract_text_from_pdf(resume)
    
    # 2. AI Analysis
    analysis = analyze_profile(resume_text, job.description)
    
    # 3. Save Final Score
    app.profile_score = analysis.get("score", 0)
    app.final_verdict = analysis.get("recommendation", "Review")
    app.current_stage = "COMPLETED"
    
    db.commit()
    return analysis
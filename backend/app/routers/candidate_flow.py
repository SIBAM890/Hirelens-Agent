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
from app.services.quiz_engine import generate_quiz_from_text

@router.get("/quiz/{application_id}")
def get_quiz(application_id: int, db: Session = Depends(get_db)):
    app = db.query(Assessment).filter(Assessment.id == application_id).first()
    if not app: raise HTTPException(status_code=404, detail="App not found")
    
    job = db.query(Job).filter(Job.id == app.job_id).first()
    if not job: raise HTTPException(status_code=404, detail="Job not found")

    # Generate Logic
    context = f"Job Title: {job.title}\nJob Description: {job.description}"
    questions = generate_quiz_from_text(context)
    
    return {"questions": questions}


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

from app.services.interview_service import generate_interview_question, evaluate_answer
from pydantic import BaseModel

class InterviewInput(BaseModel):
    answer: str
    history: list = []

@router.post("/interview/start/{application_id}")
def start_interview(application_id: int, type: str = "technical", db: Session = Depends(get_db)):
    app = db.query(Assessment).filter(Assessment.id == application_id).first()
    if not app: raise HTTPException(status_code=404, detail="App not found")
    
    job = db.query(Job).filter(Job.id == app.job_id).first()
    
    # Generate First Question
    initial_question = generate_interview_question([], job.title, job.description, interview_type=type)
    
    # Initialize Transcript
    transcript = [{"role": "ai", "text": initial_question}]
    
    if type == "HR":
        app.hr_interview_transcript = json.dumps(transcript)
    else:
        app.tech_interview_transcript = json.dumps(transcript)
        
    db.commit()
    
    return {"question": initial_question, "history": transcript}

@router.post("/interview/process/{application_id}")
def process_interview_answer(application_id: int, input_data: InterviewInput, type: str = "technical", db: Session = Depends(get_db)):
    app = db.query(Assessment).filter(Assessment.id == application_id).first()
    if not app: raise HTTPException(status_code=404, detail="App not found")
    
    job = db.query(Job).filter(Job.id == app.job_id).first()
    
    # Select Transcript based on Type
    if type == "HR":
        transcript_json = app.hr_interview_transcript
    else:
        transcript_json = app.tech_interview_transcript
        
    current_transcript = json.loads(transcript_json) if transcript_json else []
    
    # 1. Update History with User Answer
    current_transcript.append({"role": "user", "text": input_data.answer})
    
    # 2. Evaluate Answer
    last_question = current_transcript[-2]["text"] if len(current_transcript) > 1 else "Introduction"
    eval_result = evaluate_answer(last_question, input_data.answer, job.title, interview_type=type)
    
    # Update running score
    if type == "HR":
        current_score = app.hr_interview_score or 0.0
        new_score = (current_score + eval_result.get("score", 0)) / 2 if current_score > 0 else eval_result.get("score", 0)
        app.hr_interview_score = new_score
    else:
        current_score = app.tech_interview_score or 0.0
        new_score = (current_score + eval_result.get("score", 0)) / 2 if current_score > 0 else eval_result.get("score", 0)
        app.tech_interview_score = new_score
    
    # 3. Decision Point
    user_turns = len([m for m in current_transcript if m["role"] == "user"])
    max_turns = 5
    
    if user_turns >= max_turns:
        completion_msg = "Thank you. This concludes the interview section."
        if type == "technical":
            app.current_stage = "GATE_4"
            completion_msg = "Technical interview complete. Redirecting to HR Round..."
        elif type == "HR":
            app.current_stage = "COMPLETED" 
            completion_msg = "Thank you! We will review your profile and get back to you."
            
        current_transcript.append({"role": "ai", "text": completion_msg})
        
        # Save Final State
        if type == "HR":
             app.hr_interview_transcript = json.dumps(current_transcript)
        else:
             app.tech_interview_transcript = json.dumps(current_transcript)
             
        db.commit()
        return {"question": completion_msg, "history": current_transcript, "completed": True}
    
    # 4. Generate Next Question
    next_question = generate_interview_question(current_transcript, job.title, job.description, interview_type=type)
    current_transcript.append({"role": "ai", "text": next_question})
    
    # Save State
    if type == "HR":
            app.hr_interview_transcript = json.dumps(current_transcript)
    else:
            app.tech_interview_transcript = json.dumps(current_transcript)
            
    db.commit()
    
    return {"question": next_question, "history": current_transcript, "completed": False}

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
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.pdf_parser import extract_text_from_pdf
from app.services.quiz_engine import generate_quiz_from_text
from app.models import jobs, questions, assessments, users

router = APIRouter(prefix="/hr-agent", tags=["HR Agent"])

@router.post("/create-job")
async def create_job(
    # Basic
    title: str = Form(...),
    description: str = Form(...),
    pass_marks: int = Form(...),
    
    # Overview
    company_name: str = Form(...),
    location: str = Form(...),
    job_type: str = Form(...),
    experience_level: str = Form(...),
    salary_range: str = Form(None),
    deadline: str = Form(None),

    # Details
    role_summary: str = Form(None),
    responsibilities: str = Form(None),
    required_skills: str = Form(None),
    tools_tech: str = Form(None),

    # Company
    company_about: str = Form(None),
    company_mission: str = Form(None),
    perks_benefits: str = Form(None),

    # Process & Contact
    hiring_process: str = Form(None),
    contact_email: str = Form(None),
    contact_phone: str = Form(None),
    website: str = Form(None),

    # File
    knowledge_base: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Create Job Entry
    new_job = jobs.Job(
        title=title, 
        description=description, 
        pass_marks=pass_marks,
        recruiter_id=1,
        
        # New Fields
        company_name=company_name,
        location=location,
        job_type=job_type,
        experience_level=experience_level,
        salary_range=salary_range,
        deadline=deadline,
        
        role_summary=role_summary,
        responsibilities=responsibilities,
        required_skills=required_skills,
        tools_tech=tools_tech,
        
        company_about=company_about,
        company_mission=company_mission,
        perks_benefits=perks_benefits,
        
        hiring_process=hiring_process,
        contact_email=contact_email,
        contact_phone=contact_phone,
        website=website
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    # 2. Process Knowledge Base (Reuse existing logic)
    text_content = await extract_text_from_pdf(knowledge_base)
    if not text_content:
        raise HTTPException(status_code=400, detail="Could not read PDF")

    generated_quiz = generate_quiz_from_text(text_content)
    
    for q in generated_quiz:
        new_q = questions.Question(
            job_id=new_job.id,
            text=q['question'],
            category="GATE_1_QUIZ",
            options=str(q['options']),
            correct_answer=q['correct_answer']
        )
        db.add(new_q)
    
    db.commit()
    
    return {"status": "success", "job_id": new_job.id, "message": "Job Created & Agent Trained"}

@router.post("/upload-knowledge-base/{job_id}")
async def upload_knowledge_base(job_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    1. HR uploads PDF.
    2. System parses text.
    3. System generates Quiz (Gate 1).
    4. Saves questions to DB.
    """
    # Step 1: Extract Text
    text_content = await extract_text_from_pdf(file)
    if not text_content:
        raise HTTPException(status_code=400, detail="Could not read PDF")

    # Step 2: Generate Quiz using Gemini
    generated_quiz = generate_quiz_from_text(text_content)
    
    # Step 3: Save to Database
    # Save the raw text as context
    # In a real app, we'd save the text to a vector DB. For now, we just generate questions.
    
    for q in generated_quiz:
        new_q = questions.Question(
            job_id=job_id,
            text=q['question'],
            category="GATE_1_QUIZ",
            options=str(q['options']), # Storing list as string for SQLite simplicity
            correct_answer=q['correct_answer']
        )
        db.add(new_q)
    
    db.commit()
    
@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):
    # Fetch all jobs
    jobs_list = db.query(jobs.Job).all()
    
    dashboard_data = []
    try:
        for job in jobs_list:
            # Count candidates (assessments) for this job
            count = db.query(assessments.Assessment).filter(assessments.Assessment.job_id == job.id).count()
            
            dashboard_data.append({
                "id": job.id,
                "title": job.title,
                "candidates": count,
                "status": "Active" 
            })
    except Exception as e:
        print(f"CRITICAL ERROR IN DASHBOARD: {e}")
        raise HTTPException(status_code=500, detail=str(e))
        
    return dashboard_data

@router.get("/job/{job_id}")
def get_job_details(job_id: int, db: Session = Depends(get_db)):
    job = db.query(jobs.Job).filter(jobs.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.put("/edit-job/{job_id}")
def edit_job(
    job_id: int, 
    title: str = Form(...),
    description: str = Form(...),
    pass_marks: int = Form(...),
    db: Session = Depends(get_db)
):
    job = db.query(jobs.Job).filter(jobs.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.title = title
    job.description = description
    job.pass_marks = pass_marks
    
    db.commit()
    return {"status": "success", "message": "Job Updated Successfully"}

@router.get("/job-report/{job_id}")
def get_job_report(job_id: int, db: Session = Depends(get_db)):
    # 1. Get Assessments for this Job
    # We join with User to get candidate names
    results = db.query(assessments.Assessment, users.User).join(users.User, assessments.Assessment.candidate_id == users.User.id).filter(assessments.Assessment.job_id == job_id).all()
    
    report = []
    for assessment, candidate in results:
        report.append({
            "candidate_id": candidate.id,
            "email": candidate.email, # In real app, we would have name
            "stage": assessment.current_stage,
            "quiz_score": assessment.quiz_score,
            "coding_score": assessment.coding_challenge_score,
            "profile_score": assessment.profile_score,
            "final_verdict": assessment.final_verdict
        })
        
    return report
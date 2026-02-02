import google.generativeai as genai
import os
import json

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_profile(resume_text: str, job_description: str, linkedin_data: str = ""):
    """
    Gate 5: Final Sanity Check.
    Compares Resume claims vs. Job Requirements.
    """
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    Act as a Senior HR Auditor.
    
    JOB DESCRIPTION:
    {job_description}
    
    CANDIDATE RESUME:
    {resume_text}
    
    LINKEDIN/PORTFOLIO SUMMARY (Optional):
    {linkedin_data}
    
    TASK:
    1. Score the candidate's relevance to the job (0-20).
    2. Identify any "Red Flags" (e.g., resume says Expert but project descriptions are vague).
    3. Provide a final "Hire" or "No Hire" recommendation.
    
    OUTPUT JSON:
    {{
        "score": 18,
        "red_flags": ["Listed React expert but no React projects in portfolio"],
        "recommendation": "Strong Hire",
        "reasoning": "Candidate has excellent technical scores and matches 90% of requirements."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except Exception as e:
        return {
            "score": 0, 
            "red_flags": ["AI Analysis Failed"], 
            "recommendation": "Manual Review",
            "reasoning": str(e)
        }
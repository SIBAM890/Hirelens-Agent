import google.generativeai as genai
import os
import json
import logging

# Configure Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_interview_question(history, job_title, job_description, context="", interview_type="technical"):
    """
    Generates the next interview question based on conversation history and type.
    """
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        if interview_type == "HR":
            role_prompt = "You are a friendly but professional HR Manager named Sarah. You are evaluating culture fit, soft skills, and career goals."
            focus = "Focus on: Behavioral questions (STAR method), Teamwork, Conflict Resolution, Career Aspirations, and aligned values."
        else:
            role_prompt = f"You are an expert Technical Interviewer for the role of {job_title}."
            focus = "Focus on: Technical skills, Problem Solving, and System Design relevant to the job."

        system_prompt = f"""
        {role_prompt}
        Job Description: {job_description}
        {focus}
        
        Rules:
        1. Ask ONE clear, concise question at a time.
        2. Questions should be relevant to the candidate's previous answers if possible.
        3. Do not repeat questions.
        4. Keep your response short (under 50 words) specifically optimized for Text-to-Speech.
        5. Be encouraging but professional.
        
        Current Conversation History:
        {json.dumps(history, indent=2)}
        
        Generate the next question:
        """
        
        response = model.generate_content(system_prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error generating question: {e}")
        return "Could you tell me about yourself and your background?"

def evaluate_answer(question, answer, job_title, interview_type="technical"):
    """
    Evaluates the candidate's answer and returns a score (0-10) and feedback.
    """
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        if interview_type == "HR":
            criteria = "- Use of STAR method (Situation, Task, Action, Result)\n- Clarity and Communication\n- Cultural Fit indicators"
        else:
            criteria = "- Technical Correctness\n- Depth of understanding\n- Problem Solving approach"

        system_prompt = f"""
        You are a Interview Grader for the role of {job_title}.
        Interview Type: {interview_type}
        
        Question Asked: "{question}"
        Candidate's Answer: "{answer}"
        
        Task:
        Evaluate the answer on a scale of 0 to 10 based on:
        {criteria}
        
        Return the result in strictly JSON format:
        {{
            "score": <float 0-10>,
            "feedback": "<short, constructive feedback>",
            "quality": "<Poor|Average|Good|Excellent>",
            "star_analysis": "<If HR, brief comment on STAR usage, else null>"
        }}
        """
        
        response = model.generate_content(system_prompt)
        text = response.text.strip()
        
        # Cleanup JSON formatting hooks if present
        if text.startswith("```json"):
            text = text[7:-3]
            
        return json.loads(text)
        
    except Exception as e:
        logger.error(f"Error evaluating answer: {e}")
        return {"score": 5, "feedback": "Unable to evaluate automatically.", "quality": "Average"}

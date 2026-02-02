import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def ai_compile_code(problem_statement: str, user_code: str, language: str = "python"):
    """
    Checks if the user's code solves the problem correctly.
    """
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    Act as a strict Code Compiler and Unit Tester.
    
    PROBLEM:
    {problem_statement}
    
    USER CODE ({language}):
    {user_code}
    
    TASK:
    1. Check for syntax errors.
    2. Check if it solves the problem correctly (edge cases).
    3. Check Time Complexity (Efficiency).
    
    OUTPUT FORMAT (JSON ONLY):
    {{
        "status": "PASS" or "FAIL",
        "score": (0 to 20),
        "feedback": "Brief explanation of what is wrong or right."
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        # We assume the output is valid JSON (in production, add stricter parsing)
        return clean_text 
    except Exception as e:
        return '{"status": "FAIL", "score": 0, "feedback": "AI Compiler Error"}'
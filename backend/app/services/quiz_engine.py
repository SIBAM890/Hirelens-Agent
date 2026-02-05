import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_quiz_from_text(context_text: str):
    """
    Sends text to Gemini and asks for 5 JSON formatted MCQs.
    """
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    You are an expert technical recruiter. Based on the following text (which is a job description or question bank), generate 5 Multiple Choice Questions (MCQs) to test a candidate.
    
    TEXT:
    {context_text[:4000]}  # Limit text to avoid token limits

    OUTPUT FORMAT:
    Return ONLY a raw JSON array. Do not use Markdown.
    [
        {{
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option A"
        }}
    ]
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean up if Gemini adds markdown code blocks
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        quiz_json = json.loads(clean_text)
        return quiz_json
    except Exception as e:
        print(f"AI Quiz Generation Failed: {e}")
        # Fallback dummy questions if AI fails
        return [
            {
                "question": "AI generation failed. What is 2+2?",
                "options": ["3", "4", "5", "6"],
                "correct_answer": "4"
            }
        ]

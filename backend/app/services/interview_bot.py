import google.generativeai as genai
import os
import json

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_ai_response(history, message, role="interviewer"):
    model = genai.GenerativeModel('gemini-pro')
    
    # Construct context based on role
    system_prompt = "You are a friendly HR interviewer." if role == "HR" else "You are a strict technical interviewer."
    
    chat = model.start_chat(history=[])
    response = chat.send_message(f"{system_prompt}. User says: {message}")
    return response.text

import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_ai_response(history: list, current_input: str, interview_type: str):
    """
    history: List of previous messages
    interview_type: "TECHNICAL" or "HR"
    """
    model = genai.GenerativeModel('gemini-pro')
    
    # Define Persona
    if interview_type == "TECHNICAL":
        system_instruction = "You are a strict Technical Interviewer. Ask deep coding questions. Keep responses short (under 50 words). Do not be overly polite."
    else:
        system_instruction = "You are a friendly HR Manager. Assess culture fit and communication skills. Be professional and encouraging."
        
    # Construct Chat
    chat = model.start_chat(history=[])
    
    # Send context + user input
    full_prompt = f"{system_instruction}\n\nUser: {current_input}"
    
    response = chat.send_message(full_prompt)
    return response.text
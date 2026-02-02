import PyPDF2
from fastapi import UploadFile

async def extract_text_from_pdf(file: UploadFile) -> str:
    """
    Reads a PDF file and returns the text content.
    """
    try:
        # Read the file stream
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        return text.strip()
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return ""
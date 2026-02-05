import PyPDF2

async def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file.file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

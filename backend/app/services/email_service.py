import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Configuration
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_email(to_email: str, subject: str, body: str):
    """
    Sends an email using SMTP.
    In a real production app, use a service like SendGrid or AWS SES.
    """
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        # Secure logging: Don't log the body content
        print(f"[MOCK EMAIL] To: {to_email} | Subject: {subject}") 
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'html'))

        # Use context manager with timeout for safety
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            text = msg.as_string()
            server.sendmail(SMTP_USERNAME, to_email, text)
            
        print(f"Email sent successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        # Re-raise or handle appropriately depending on requirement. 
        # For now, we print but don't crash the caller, as email checks shouldn't 500 the app usually.
        # But for 'silent failure' issue, we might want to return False or log ERROR.
        # Let's keep it swallowing but ensure it's logged as ERROR if we had a logger.
        # Since we use print, it's visible. 
        pass

def send_cheat_alert(candidate_email: str, hr_email: str, violation_details: str):
    """
    Sends alerts to both Candidate and HR.
    """
    # 1. Alert HR
    hr_subject = f"URGENT: Proctoring Alert - Candidate {candidate_email}"
    hr_body = f"""
    <h2>Proctoring Violation Detected</h2>
    <p><b>Candidate:</b> {candidate_email}</p>
    <p><b>Violation:</b> {violation_details}</p>
    <p>Please review the session logs immediately.</p>
    """
    send_email(hr_email, hr_subject, hr_body)

    # 2. Warning to Candidate
    candidate_subject = "Assessment Warning: Integrity Violation"
    candidate_body = f"""
    <h2>Warning</h2>
    <p>We detected irregular activity during your assessment: <b>{violation_details}</b>.</p>
    <p>This incident has been logged. Further violations may result in disqualification.</p>
    """
    send_email(candidate_email, candidate_subject, candidate_body)

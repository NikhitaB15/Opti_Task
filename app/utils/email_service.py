import os
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

from dotenv import load_dotenv
load_dotenv()

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
SENDER_EMAIL = os.getenv("SENDER") 

sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)

def send_email(to_email: str, subject: str, message: str):
    """Send an email notification using SendGrid."""
    from_email = Email(SENDER_EMAIL)
    to_email = To(to_email)
    content = Content("text/plain", message)
    
    mail = Mail(from_email, to_email, subject, content)
    
    try:
        response = sg.client.mail.send.post(request_body=mail.get())
        print(f"Email sent to {to_email}: {response.status_code}")
    except Exception as e:
        print(f"zError sending email: {e}")
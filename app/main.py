from fastapi import FastAPI
from app.database import Base, engine
from app.routes import users, tasks, chats
import logging
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
app = FastAPI(title="Task Management API")


conversation_history = {}
class PromptRequest(BaseModel):
    session_id: str 
    prompt: str
    model: str = "llama-3.3-70b-versatile"  
SYSTEM_INSTRUCTION = {
    "role": "system",
    "content": (
        "You are OptiTask AI, an intelligent assistant for OptiTask, an AI-powered task management application. "
        "Your role is to assist users with their questions about the app, its features, and how to use it effectively.\n\n"
        
        "About OptiTask:\n"
        "OptiTask is a smart task management tool that helps individuals and teams organize, prioritize, and automate their tasks efficiently. "
        "It integrates AI-powered assistance for scheduling, reminders, and task recommendations.\n\n"

        "Key Features:\n"
        "- Smart Task Prioritization – AI analyzes deadlines, importance, and dependencies to suggest the optimal task order.\n"
        
        "- Collaborative Task Management – Assign, track, and collaborate on tasks seamlessly with your team.\n"
        "- AI Chat Assistant – Get instant help with organizing tasks, setting goals, and productivity tips.\n"
        "- Customizable Workflows – Tailor workflows to fit personal or team-based productivity needs.\n\n"

        "How You Should Respond:\n"
        "- Answer user questions ONLY related to OptiTask.\n"
        "- Provide step-by-step guidance on using features.\n"
        "- Suggest best practices for productivity.\n"
        "- If a feature is unavailable, politely inform the user and offer alternatives.\n"
        "- Format responses clearly using:\n"
        "  - Summary: Short explanation\n"
        "  - Example: Practical use case\n"
        "  - Steps: How to use the features\n\n"

        "Example Queries:\n"
        "1. How do I create a new task?\n"
        "   - Reply with step-by-step instructions.\n"
        "2. Can OptiTask send reminders?\n"
        "   - Explain the AI-powered reminders feature.\n"
        "3. How does the AI prioritize tasks?\n"
        "   - Explain the logic behind smart task prioritization.\n\n"

        "⚠️ Avoid discussing unrelated topics. If asked about something outside OptiTask, politely redirect the user to task management-related assistance."
    )
}

@app.post("/generate")
def generate_text(request: PromptRequest):
    
    try:
        if request.session_id not in conversation_history:
            conversation_history[request.session_id] = [SYSTEM_INSTRUCTION]

        conversation_history[request.session_id].append({"role": "user", "content": request.prompt})
        
        response = client.chat.completions.create(
            messages=conversation_history[request.session_id],
            model=request.model,
        )
        assistant_message = response.choices[0].message.content
        conversation_history[request.session_id].append({"role": "assistant", "content": assistant_message})
        
        return {"response": assistant_message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

origins = [
    "http://localhost:5173",
    "localhost:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


load_dotenv()
from app.database import Base, engine

print("Creating tables in SQL Server........")
Base.metadata.create_all(bind=engine)
print("created tables!........")



logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f" Response status: {response.status_code}")
    return response

print("working fine.......................................")
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(chats.router, prefix="/chats", tags=["Chats"])
@app.get("/",tags=["root"])
def home():
    return {"message": "Welcome to the Task Management API!"}

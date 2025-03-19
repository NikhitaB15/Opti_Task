from fastapi import FastAPI
from app.database import Base, engine
from app.routes import users, tasks
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

@app.post("/generate")
def generate_text(request: PromptRequest):
    try:
        if request.session_id not in conversation_history:
            conversation_history[request.session_id] = []
        
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

@app.get("/",tags=["root"])
def home():
    return {"message": "Welcome to the Task Management API!"}

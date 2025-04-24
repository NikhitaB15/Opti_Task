from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskCreate(TaskBase):
    due_date: Optional[datetime] = None
    priority: int = 3
    assigned_to_id: Optional[int] = None  

class TaskFilter(BaseModel):
    completed: Optional[bool] = None
    priority: Optional[int] = None
    due_date: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: int
    owner_id: int
    assigned_to_id: Optional[int] = None

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    chat_id: int
    sender_id: int
    content: str
    created_at: datetime
    is_admin: bool
    is_read: bool
    
    class Config:
        from_attributes = True 

class ChatMessage(BaseModel):
    id: int 
    sender_id: int
    content: str
    created_at: datetime
    is_admin: bool
    is_read: bool
    
    class Config:
        from_attributes = True

class ChatCreate(BaseModel):
    title: str
    is_admin_chat: bool = False

class ChatResponse(BaseModel):
    id:int
    user_id: int
    title: str
    is_admin_chat: bool
    messages: Optional[List[MessageResponse]] = []

    class Config:
        from_attributes = True
        
class AdminStatusResponse(BaseModel):
    
    is_online: bool
    last_seen: datetime

    class Config:
        from_attributes = True
        
class AdminStatusUpdate(BaseModel):
    is_online: bool        
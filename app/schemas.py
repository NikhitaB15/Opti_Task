from pydantic import BaseModel,EmailStr

from typing import Optional
from datetime import datetime, timedelta, timezone
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class TaskBase(BaseModel):
    title: str
    description: str | None = None
    completed: bool = False

class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    completed: bool = False
    due_date: datetime | None = None
    priority: int = 3
    assigned_to_id: int | None = None  

class TaskFilter(BaseModel):
    completed: bool | None = None
    priority: int | None = None
    due_date: datetime | None = None

class TaskResponse(TaskBase):
    id: int
    owner_id: int
    assigned_to_id: int | None = None

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: str
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

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import enum

class Role(enum.Enum):
    user = "user"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(Role), nullable=False, server_default="user")  

    tasks = relationship("Task", back_populates="owner", cascade="all, delete", foreign_keys="[Task.owner_id]")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), index=True, nullable=False)
    description = Column(String(255), nullable=True)
    completed = Column(Boolean, default=False, nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    due_date = Column(DateTime, nullable=True)
    priority = Column(Integer, nullable=False, server_default="3") 
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    owner = relationship("User", foreign_keys=[owner_id], back_populates="tasks")
    assigned_to = relationship("User", foreign_keys=[assigned_to_id])  

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Enum, DateTime, Text
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

    # Relationships
    tasks = relationship("Task", back_populates="owner", cascade="all, delete", 
                        foreign_keys="[Task.owner_id]")
    chats = relationship("Chat", back_populates="user", cascade="all, delete", 
                        foreign_keys="[Chat.user_id]")
    sent_messages = relationship("ChatMessage", back_populates="sender", 
                               foreign_keys="[ChatMessage.sender_id]")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, role={self.role})>"
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
    
class Chat(Base):
    __tablename__ = "chats"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_admin_chat = Column(Boolean, default=False)

    # Relationships
    messages = relationship("ChatMessage", back_populates="chat", 
                          cascade="all, delete-orphan")
    user = relationship("User", back_populates="chats")

    def __repr__(self):
        return f"<Chat(id={self.id}, user_id={self.user_id}, is_admin={self.is_admin_chat})>"

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id", ondelete="CASCADE"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_admin = Column(Boolean, default=False)
    is_read = Column(Boolean, default=False)
    
    # Relationships
    chat = relationship("Chat", back_populates="messages")
    sender = relationship("User", back_populates="sent_messages")

    def __repr__(self):
        return f"<ChatMessage(id={self.id}, chat_id={self.chat_id}, sender_id={self.sender_id})>"

class AdminStatus(Base):
    __tablename__ = "admin_status"

    id = Column(Integer, primary_key=True, index=True)
    is_online = Column(Boolean, default=False, nullable=False)
    last_seen = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<AdminStatus(is_online={self.is_online}, last_seen={self.last_seen})>"
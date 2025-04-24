from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid

from app.database import get_db
from app.models import Chat, ChatMessage, User, AdminStatus
from app.schemas import ChatCreate, ChatResponse, MessageCreate, MessageResponse,AdminStatusUpdate
from app.auth import get_current_user

router = APIRouter()

# Create a new admin chat
@router.post("/admin", response_model=ChatResponse)
def create_admin_chat(
    chat_data: ChatCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Check if user already has an active admin chat
    existing_chat = db.query(Chat).filter(
        Chat.user_id == user.id,
        Chat.is_admin_chat == True
    ).first()

    if existing_chat:
        return existing_chat

    # Create a new admin chat
    new_chat = Chat(
        title=chat_data.title,
        user_id=user.id,
        is_admin_chat=True,
        created_at=datetime.utcnow()
    )
    
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    
    return {
        "id": new_chat.id,
        "user_id": new_chat.user_id,
        "title": new_chat.title,
        "is_admin_chat": new_chat.is_admin_chat,
        "messages": []
    }
# Get user's active admin chat
@router.get("/admin", response_model=ChatResponse)
def get_admin_chat(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(
        Chat.user_id == user.id,
        Chat.is_admin_chat == True
    ).first()
    
    if not chat:
        raise HTTPException(status_code=404, detail="No active admin chat found")
    
    messages = db.query(ChatMessage).filter(
        ChatMessage.chat_id == chat.id
    ).order_by(ChatMessage.created_at.asc()).all()
    
    formatted_messages = [
        {
            "id": msg.id,
            "chat_id": msg.chat_id,
            "sender_id": msg.sender_id,
            "content": msg.content,
            "created_at": msg.created_at,
            "is_admin": msg.is_admin,
            "is_read": msg.is_read
        } for msg in messages
    ]
    
    return {
        "id": chat.id,
        "user_id": chat.user_id,
        "title": chat.title,
        "is_admin_chat": chat.is_admin_chat,
        "messages": formatted_messages
    }
# Send message in an admin chat
@router.post("/admin/message", response_model=MessageResponse)
def send_admin_message(
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Find the user's admin chat
    chat = db.query(Chat).filter(
        Chat.user_id == user.id,
        Chat.is_admin_chat == True
    ).first()
    
    if not chat:
        # Create a new admin chat if one doesn't exist
        chat = Chat(
            title=f"Support Chat - {user.username}",
            user_id=user.id,
            is_admin_chat=True,
            created_at=datetime.utcnow()
        )
        db.add(chat)
        db.commit()
        db.refresh(chat)
    
    # Create the message
    new_message = ChatMessage(
        chat_id=chat.id,
        sender_id=user.id,
        content=message_data.content,
        created_at=datetime.utcnow(),
        is_admin=False,  # User message, not admin
        is_read=False
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return new_message

# Admin sends a reply
@router.post("/admin/reply/{chat_id}", response_model=MessageResponse)
def admin_reply(
    chat_id: int,
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Only admins can send replies")
    
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    new_message = ChatMessage(
        chat_id=chat.id,
        sender_id=user.id,
        content=message_data.content,
        created_at=datetime.utcnow(),
        is_admin=True,
        is_read=False
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return {
        "id": new_message.id,
        "chat_id": new_message.chat_id,
        "sender_id": new_message.sender_id,
        "content": new_message.content,
        "created_at": new_message.created_at,
        "is_admin": new_message.is_admin,
        "is_read": new_message.is_read
    }

# Get all admin chats (admin only)
@router.get("/admin/all", response_model=List[ChatResponse])
def get_all_admin_chats(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view all chats")
    
    chats = db.query(Chat).filter(Chat.is_admin_chat == True).all()
    
    result = []
    for chat in chats:
        messages = db.query(ChatMessage).filter(
            ChatMessage.chat_id == chat.id
        ).order_by(ChatMessage.created_at.asc()).all()
        
        formatted_messages = [
            {
                "id": msg.id,
                "chat_id": msg.chat_id,
                "sender_id": msg.sender_id,
                "content": msg.content,
                "created_at": msg.created_at,
                "is_admin": msg.is_admin,
                "is_read": msg.is_read
            } for msg in messages
        ]
        
        result.append({
            "id": chat.id,
            "user_id": chat.user_id,
            "title": chat.title,
            "is_admin_chat": chat.is_admin_chat,
            "messages": formatted_messages
        })
    
    return result
# Mark messages as read
@router.put("/admin/read/{chat_id}")
def mark_messages_read(
    chat_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # Users can only mark messages in their own chats
    # Admins can mark messages in any chat
    if chat.user_id != user.id and user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to access this chat")
    
    # Determine which messages to mark as read
    if user.role.value == "admin":
        # Admin marks user messages as read
        unread_messages = db.query(ChatMessage).filter(
            ChatMessage.chat_id == chat_id,
            ChatMessage.is_admin == False,
            ChatMessage.is_read == False
        ).all()
    else:
        # User marks admin messages as read
        unread_messages = db.query(ChatMessage).filter(
            ChatMessage.chat_id == chat_id,
            ChatMessage.is_admin == True,
            ChatMessage.is_read == False
        ).all()
    
    # Mark messages as read
    for message in unread_messages:
        message.is_read = True
    
    db.commit()
    
    return {"message": f"Marked {len(unread_messages)} messages as read"}



    
# Get admin online status
@router.get("/admin/status")
def get_admin_status(
    db: Session = Depends(get_db)
):
    status = db.query(AdminStatus).first()
    if not status:
        # Create default status if it doesn't exist
        status = AdminStatus(is_online=False, last_seen=datetime.utcnow())
        db.add(status)
        db.commit()
        db.refresh(status)
    
    return {
        "is_online": status.is_online,
        "last_seen": status.last_seen
    }

# Update admin online status (admin only)
@router.put("/admin/status")
def update_admin_status(
    status_data: AdminStatusUpdate,  # Changed to use the schema
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Ensure the user is an admin
    if user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update status")
    
    status = db.query(AdminStatus).first()
    if not status:
        status = AdminStatus()
        db.add(status)
    
    status.is_online = status_data.is_online  # Changed to use status_data
    status.last_seen = datetime.utcnow()
    
    db.commit()
    db.refresh(status)
    
    return {
        "is_online": status.is_online,
        "last_seen": status.last_seen
    }
# Get unread message counts (for notifications)
@router.get("/admin/unread")
def get_unread_counts(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if user.role.value == "admin":
        # For admin: count of unread messages from all users
        unread_count = db.query(ChatMessage).filter(
            ChatMessage.is_admin == False,
            ChatMessage.is_read == False
        ).count()
        
        # Get counts by user for detailed breakdown
        chats = db.query(Chat).filter(Chat.is_admin_chat == True).all()
        user_counts = {}
        
        for chat in chats:
            count = db.query(ChatMessage).filter(
                ChatMessage.chat_id == chat.id,
                ChatMessage.is_admin == False,
                ChatMessage.is_read == False
            ).count()
            
            if count > 0:
                chat_user = db.query(User).filter(User.id == chat.user_id).first()
                if chat_user:
                    user_counts[chat_user.username] = count
        
        return {
            "total_unread": unread_count,
            "by_user": user_counts
        }
    else:
        # For regular user: count of unread admin messages
        chat = db.query(Chat).filter(
            Chat.user_id == user.id,
            Chat.is_admin_chat == True
        ).first()
        
        if not chat:
            return {"unread_count": 0}
        
        unread_count = db.query(ChatMessage).filter(
            ChatMessage.chat_id == chat.id,
            ChatMessage.is_admin == True,
            ChatMessage.is_read == False
        ).count()
        
        return {"unread_count": unread_count}
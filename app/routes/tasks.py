from fastapi import APIRouter, Depends, HTTPException, Query
from app.utils.email_service import send_email  
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Task, User
from app.schemas import TaskCreate, TaskResponse
from app.auth import get_current_user
from datetime import datetime

router = APIRouter()

#  Create a Task (Admin Only)
@router.post("/", response_model=TaskResponse)
def create_task(
    task: TaskCreate, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    if user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create tasks!")

    db_task = Task(**task.model_dump(), owner_id=user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    
    send_email(user.email, "Task Created", f"Your task '{task.title}' has been created.")

    return db_task


#  Assign Task to Another User (Admin Only)
@router.put("/{task_id}/assign/{user_id}")
def assign_task(
    task_id: int, 
    user_id: int, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    """ Admin assigns a task to another user """
    if user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Only admins can assign tasks!")

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found!")

    assigned_user = db.query(User).filter(User.id == user_id).first()
    if not assigned_user:
        raise HTTPException(status_code=404, detail="User not found!")

    task.assigned_to_id = user_id
    db.commit()
    db.refresh(task)

    
    send_email(
        assigned_user.email,
        "New Task Assigned",
        f"You have been assigned a new task: '{task.title}'."
    )

    return {"message": f"Task '{task.title}' assigned to user {assigned_user.username} successfully!"}


#  Update a Task (Only Owner or Admin)
@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int, 
    updated_task: TaskCreate, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.owner_id != user.id and user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this task!")

    task.title = updated_task.title
    task.description = updated_task.description
    task.completed = updated_task.completed
    task.priority = updated_task.priority
    task.due_date = updated_task.due_date

    db.commit()
    db.refresh(task)
    return task


#  Delete a Task (Only Owner or Admin)
@router.delete("/{task_id}")
def delete_task(
    task_id: int, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.owner_id != user.id and user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this task!")

    db.delete(task)
    db.commit()

    #  Send Email Notification to Owner (if exists)
    owner = db.query(User).filter(User.id == task.owner_id).first()
    if owner:
        send_email(owner.email, "Task Deleted", f"Your task '{task.title}' has been deleted.")

    return {"message": "Task deleted successfully"}


#  Mark a Task as Completed (Only Owner or Assigned User)
@router.patch("/{task_id}/complete")
def complete_task(
    task_id: int, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.owner_id != user.id and task.assigned_to_id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to complete this task!")

    task.completed = True
    db.commit()

    #  Notify Task Owner
    owner = db.query(User).filter(User.id == task.owner_id).first()
    if owner:
        send_email(owner.email, "Task Completed", f"Your task '{task.title}' has been completed.")

    #  Notify Assigned User (if exists)
    if task.assigned_to_id:
        assigned_user = db.query(User).filter(User.id == task.assigned_to_id).first()
        if assigned_user:
            send_email(
                assigned_user.email,
                "Task Marked as Completed",
                f"The task '{task.title}' assigned to you has been completed."
            )

    return {"message": "Task marked as completed"}


#  Get All Tasks with Filtering & Sorting (Admins see all, users see their own)

@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    completed: Optional[bool] = None,
    priority: Optional[int] = Query(None, ge=1, le=5),
    due_date: Optional[str] = None,
    sort_by: Optional[str] = Query("due_date", regex="^(due_date|priority|title)$"),
    sort_order: Optional[str] = Query("asc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = db.query(Task)

    #  Non-admin users should only see their own tasks
    if user.role.value != "admin":
        query = query.filter((Task.owner_id == user.id) | (Task.assigned_to_id == user.id))

    if completed is not None:
        query = query.filter(Task.completed == completed)
    if priority is not None:
        query = query.filter(Task.priority == priority)
    if due_date:
        query = query.filter(Task.due_date == datetime.strptime(due_date, "%Y-%m-%d"))

    
    order_by_column = getattr(Task, sort_by)
    if sort_order == "desc":
        query = query.order_by(order_by_column.desc())
    else:
        query = query.order_by(order_by_column)

    return query.all()
# 🚀 Get Task Statistics (Admin sees all, users see their own)
@router.get("/summary")
def get_task_summary(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = db.query(Task)

    # Non-admin users should only see their own tasks
    if user.role.value != "admin":
        query = query.filter((Task.owner_id == user.id) | (Task.assigned_to_id == user.id))

    tasks = query.all()

    return {
        "totalTasks": len(tasks),
        "completedTasks": sum(1 for task in tasks if task.completed),
        "pendingTasks": sum(1 for task in tasks if not task.completed),
        "highPriority": sum(1 for task in tasks if task.priority == 1),
        "mediumPriority": sum(1 for task in tasks if task.priority == 2),
        "lowPriority": sum(1 for task in tasks if task.priority == 3),
    }

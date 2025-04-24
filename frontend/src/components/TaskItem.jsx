import { deleteTask, markTaskCompleted } from "../api/tasks";
import { useAuth } from "../context/AuthContext";
import { toast,ToastContainer } from "react-toastify";
import React from "react";

const TaskItem = ({ task }) => {
  const { token } = useAuth();

  const handleDelete = async () => {
    try {
      await deleteTask(task.id, token);
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleComplete = async () => {
    try {
      await markTaskCompleted(task.id, token);
      toast.success("Task marked as complete");
    } catch (error) {
      toast.error("Failed to mark as complete");
    }
  };

  return (
    <div className="p-4 bg-gray-100 shadow-md rounded flex justify-between items-center">
      {/* <ToastContainer/> */}
      <div>
        <h3 className="text-lg font-bold">{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <div className="flex space-x-2">
        {/* Resized Done Image */}
        <button onClick={handleComplete} className="bg-green-200 text-white p-2 rounded">
          <img className="w-5 h-5" src="done.png" alt="Done" />
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-2 py-1 rounded">
        <img className="w-5 h-5" src="delete.png" alt="Done" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;

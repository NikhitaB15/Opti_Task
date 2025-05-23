import { useState, useEffect } from "react";
import { createTask } from "../api/tasks";
import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../api/auth";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

const CreateTask = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme } = useTheme();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    completed: false,
    due_date: new Date().toISOString().split('T')[0],
    priority: 1, // Default to low priority (1)
    assigned_to_id: "",
  });

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      if (user && user.role === "admin") {
        setIsAdmin(true);
        try {
          const response = await getAllUsers();
          setUsers(response.data);
        } catch (error) {
          console.error("Failed to fetch users:", error);
        }
      }
    };

    checkAdminAndFetchUsers();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Handle radio buttons differently since they return strings
    if (name === "priority") {
      setTaskData({ ...taskData, [name]: parseInt(value, 10) });
    } else {
      setTaskData({ ...taskData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formattedData = {
        ...taskData,
        // Ensure priority is properly converted to number
        priority: typeof taskData.priority === 'string' ? parseInt(taskData.priority, 10) : taskData.priority,
        ...(taskData.assigned_to_id ? { assigned_to_id: parseInt(taskData.assigned_to_id, 10) } : {})
      };
      
      await createTask(formattedData, token);
      toast.success("Task created successfully!");
      
      // Reset form with default priority (1)
      setTaskData({
        title: "",
        description: "",
        completed: false,
        due_date: new Date().toISOString().split('T')[0],
        priority: 1,
        assigned_to_id: "",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.response?.data?.detail || "Failed to create task");
    }
  };

  // Priority configuration
  const priorityOptions = [
    { value: 1, label: "Low Priority", color: "bg-green-100 border-green-300 text-green-800" },
    { value: 2, label: "Medium Priority", color: "bg-yellow-100 border-yellow-300 text-yellow-800" },
    { value: 3, label: "High Priority", color: "bg-red-100 border-red-300 text-red-800" }
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-xl p-6">
        <h2 className="text-3xl font-bold text-white">Create New Task</h2>
        <p className="text-blue-100 mt-2">Fill in the details to create a new task</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-lg p-8 border border-gray-200">
        {/* Title and Description fields remain the same */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Task Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="What needs to be done?"
            value={taskData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Add details about this task..."
            value={taskData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            rows="4"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              value={taskData.due_date}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Priority Level
            </label>
            <div className="flex gap-4">
              {priorityOptions.map((option) => (
                <label 
                  key={option.value}
                  className={`flex-1 rounded-lg border p-3 cursor-pointer flex items-center justify-center ${
                    taskData.priority === option.value 
                      ? `${option.color} ring-2 ring-offset-2 ring-blue-500` 
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                  } transition duration-200`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={option.value}
                    checked={taskData.priority === option.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {isAdmin && (
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Assign To
            </label>
            <select
              name="assigned_to_id"
              value={taskData.assigned_to_id}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
            >
              <option value="">Select Team Member</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username || user.email}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 focus:ring-4 focus:ring-blue-300 transition duration-300 shadow-md"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;
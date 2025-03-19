import { useEffect, useState } from "react";
import { fetchTasks } from "../api/tasks";
import { useAuth } from "../context/AuthContext";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [filter, setFilter] = useState({ 
    completed: null, 
    priority: null,
    sortBy: "due_date",
    sortOrder: "asc" 
  });
  const { token } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  
  useEffect(() => {
    const loadTasks = async () => {
      try {
        // Make sure we pass all filter parameters correctly to the API
        const response = await fetchTasks(
          token, 
          {
            completed: filter.completed,
            priority: filter.priority,
            sortBy: filter.sortBy,
            sortOrder: filter.sortOrder
          }, 
          currentPage, 
          tasksPerPage
        );
        setTasks(response.data.items || response.data);
        setTotalTasks(response.data.total || response.data.length);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };
    loadTasks();
  }, [token, filter, currentPage]);

  const handleFilterChange = (filterName, value) => {
    // Reset to page 1 when changing filters
    setCurrentPage(1);
    setFilter({ ...filter, [filterName]: value });
  };

  const handleSortChange = (e) => {
    setCurrentPage(1);
    setFilter({ ...filter, sortBy: e.target.value });
  };

  const handleSortOrderChange = () => {
    setCurrentPage(1);
    // Toggle the sort order explicitly
    const newSortOrder = filter.sortOrder === "asc" ? "desc" : "asc";
    setFilter({ 
      ...filter, 
      sortOrder: newSortOrder
    });
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <select 
          className="p-2 border rounded" 
          value={filter.completed === null ? "" : filter.completed.toString()}
          onChange={(e) => {
            const val = e.target.value === "" ? null : e.target.value === "true";
            handleFilterChange("completed", val);
          }}
        >
          <option value="">All</option>
          <option value="true">Completed</option>
          <option value="false">Pending</option>
        </select>
        
        <select 
          className="p-2 border rounded"
          value={filter.priority || ""}
          onChange={(e) => handleFilterChange("priority", e.target.value || null)}
        >
          <option value="">All Priorities</option>
          <option value="1">High (1)</option>
          <option value="2">Medium (2)</option>
          <option value="3">Low (3)</option>
        </select>
        
        <select 
          className="p-2 border rounded"
          value={filter.sortBy}
          onChange={handleSortChange}
        >
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
        
        <button 
          className="p-2 border rounded"
          onClick={handleSortOrderChange}
        >
          {filter.sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
        </button>
      </div>

      {/* Task List */}
      {tasks.length > 0 ? (
        tasks.map((task) => <TaskItem key={task.id} task={task} />)
      ) : (
        <p className="text-center my-4">No tasks found.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-4">
        <button 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-bold text-blue-600">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskList;
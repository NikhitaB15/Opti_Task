// import { useEffect, useState } from "react";
// import { fetchTasks } from "../api/tasks";
// import { useAuth } from "../context/AuthContext";
// import TaskItem from "./TaskItem";

// const TaskList = () => {
//   const [tasks, setTasks] = useState([]);
//   const [totalTasks, setTotalTasks] = useState(0);
//   const [filter, setFilter] = useState({ 
//     completed: null, 
//     priority: null,
//     sortBy: "due_date",
//     sortOrder: "asc" 
//   });
//   const { token } = useAuth();

//   const [currentPage, setCurrentPage] = useState(1);
//   const tasksPerPage = 5;
  
//   useEffect(() => {
//     const loadTasks = async () => {
//       try {
//         // Make sure we pass all filter parameters correctly to the API
//         const response = await fetchTasks(
//           token, 
//           {
//             completed: filter.completed,
//             priority: filter.priority,
//             sortBy: filter.sortBy,
//             sortOrder: filter.sortOrder
//           }, 
//           currentPage, 
//           tasksPerPage
//         );
//         setTasks(response.data.items || response.data);
//         setTotalTasks(response.data.total || response.data.length);
//       } catch (error) {
//         console.error("Failed to fetch tasks", error);
//       }
//     };
//     loadTasks();
//   }, [token, filter, currentPage]);

//   const handleFilterChange = (filterName, value) => {
//     // Reset to page 1 when changing filters
//     setCurrentPage(1);
//     setFilter({ ...filter, [filterName]: value });
//   };

//   const handleSortChange = (e) => {
//     setCurrentPage(1);
//     setFilter({ ...filter, sortBy: e.target.value });
//   };

//   const handleSortOrderChange = () => {
//     setCurrentPage(1);
//     // Toggle the sort order explicitly
//     const newSortOrder = filter.sortOrder === "asc" ? "desc" : "asc";
//     setFilter({ 
//       ...filter, 
//       sortOrder: newSortOrder
//     });
//   };

//   // Calculate total pages
//   const totalPages = Math.ceil(totalTasks / tasksPerPage);

//   return (
//     <div>
//       {/* Filters */}
//       <div className="mb-4 flex gap-4">
//         <select 
//           className="p-2 border rounded" 
//           value={filter.completed === null ? "" : filter.completed.toString()}
//           onChange={(e) => {
//             const val = e.target.value === "" ? null : e.target.value === "true";
//             handleFilterChange("completed", val);
//           }}
//         >
//           <option value="">All</option>
//           <option value="true">Completed</option>
//           <option value="false">Pending</option>
//         </select>
        
//         <select 
//           className="p-2 border rounded"
//           value={filter.priority || ""}
//           onChange={(e) => handleFilterChange("priority", e.target.value || null)}
//         >
//           <option value="">All Priorities</option>
//           <option value="1">High (1)</option>
//           <option value="2">Medium (2)</option>
//           <option value="3">Low (3)</option>
//         </select>
        
//         <select 
//           className="p-2 border rounded"
//           value={filter.sortBy}
//           onChange={handleSortChange}
//         >
//           <option value="due_date">Due Date</option>
//           <option value="priority">Priority</option>
//           <option value="title">Title</option>
//         </select>
        
//         <button 
//           className="p-2 border rounded"
//           onClick={handleSortOrderChange}
//         >
//           {filter.sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
//         </button>
//       </div>

//       {/* Task List */}
//       {tasks.length > 0 ? (
//         tasks.map((task) => <TaskItem key={task.id} task={task} />)
//       ) : (
//         <p className="text-center my-4">No tasks found.</p>
//       )}

//       {/* Pagination Controls */}
//       <div className="flex justify-center mt-4 space-x-4">
//         <button 
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//           className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span className="font-bold text-blue-600">
//           Page {currentPage} of {totalPages || 1}
//         </span>
//         <button 
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage >= totalPages}
//           className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TaskList;


import { useEffect, useState } from "react";
import { fetchTasks } from "../api/tasks";
import { useAuth } from "../context/AuthContext";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
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
      } finally {
        setLoading(false);
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
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 pb-2 border-b border-gray-200">Task Management</h2>
      
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:bg-gray-100">
        <div className="relative group">
          <select 
            className="p-2 pl-4 pr-10 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 w-full sm:w-auto appearance-none transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300"
            value={filter.completed === null ? "" : filter.completed.toString()}
            onChange={(e) => {
              const val = e.target.value === "" ? null : e.target.value === "true";
              handleFilterChange("completed", val);
            }}
          >
            <option value="">All Tasks</option>
            <option value="true">Completed</option>
            <option value="false">Pending</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          <span className="absolute -top-2 left-2 px-1 text-xs font-medium text-blue-600 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200">Status</span>
        </div>
        
        <div className="relative group">
          <select 
            className="p-2 pl-4 pr-10 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 w-full sm:w-auto appearance-none transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300"
            value={filter.priority || ""}
            onChange={(e) => handleFilterChange("priority", e.target.value || null)}
          >
            <option value="">All Priorities</option>
            <option value="1">High (1)</option>
            <option value="2">Medium (2)</option>
            <option value="3">Low (3)</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          <span className="absolute -top-2 left-2 px-1 text-xs font-medium text-blue-600 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200">Priority</span>
        </div>
        
        <div className="relative group">
          <select 
            className="p-2 pl-4 pr-10 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 w-full sm:w-auto appearance-none transition-all duration-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 hover:border-blue-300"
            value={filter.sortBy}
            onChange={handleSortChange}
          >
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
          <span className="absolute -top-2 left-2 px-1 text-xs font-medium text-blue-600 bg-gray-50 group-hover:bg-gray-100 transition-colors duration-200">Sort By</span>
        </div>
        
        <button 
          className={`p-2 border border-gray-300 rounded-md shadow-sm ${filter.sortOrder === "asc" ? "bg-blue-50 text-blue-700 border-blue-300" : "bg-purple-50 text-purple-700 border-purple-300"} transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 px-4 flex items-center justify-center w-full sm:w-auto`}
          onClick={handleSortOrderChange}
        >
          {filter.sortOrder === "asc" ? (
            <>
              <svg className="w-4 h-4 mr-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
              </svg>
              Ascending
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
              Descending
            </>
          )}
        </button>
      </div>

      {/* Task List with loading state */}
      <div className="space-y-4 min-h-64">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : tasks.length > 0 ? (
          <div className="space-y-3 transition-all duration-300">
            {tasks.map((task, index) => (
              <div 
                key={task.id} 
                className="transform transition-all duration-300" 
                style={{ 
                  opacity: 0,
                  animation: `fadeIn 0.5s ease-out forwards ${index * 0.1}s`
                }}
              >
                <style>{`
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                <TaskItem task={task} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <p className="text-gray-600 font-medium">No tasks found with the current filters.</p>
            <button 
              onClick={() => setFilter({ completed: null, priority: null, sortBy: "due_date", sortOrder: "asc" })}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 transform hover:scale-105"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {tasks.length > 0 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing <span className="font-medium">{Math.min((currentPage - 1) * tasksPerPage + 1, totalTasks)}</span> to <span className="font-medium">{Math.min(currentPage * tasksPerPage, totalTasks)}</span> of <span className="font-medium">{totalTasks}</span> tasks
          </span>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm transition-all duration-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Prev
            </button>
            
            <div className="hidden sm:flex space-x-1">
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  onClick={() => setCurrentPage(page + 1)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-all duration-300 ${
                    currentPage === page + 1
                      ? "bg-blue-500 text-white font-medium shadow-md transform scale-105"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
            
            <div className="sm:hidden px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center justify-center">
              <span className="font-medium">{currentPage} / {totalPages}</span>
            </div>
            
            <button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm transition-all duration-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center"
            >
              Next
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
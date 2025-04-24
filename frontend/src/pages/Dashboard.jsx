import React, { useState, useEffect } from "react";
import TaskList from "../components/TaskList";
import TaskStats from "../components/TaskStats";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5); // Number of tasks to show per page

  // This would come from your TaskList component or API
  // For demo purposes, we'll assume TaskList passes all tasks up to the Dashboard
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Calculate pagination values
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = allTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(allTasks.length / tasksPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle tasks data from TaskList (if using child-to-parent communication)
  const handleTasksUpdate = (tasks) => {
    setAllTasks(tasks);
    // Reset to first page when tasks change
    setCurrentPage(1);
  };

  return (
    <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`min-h-screen py-8 px-4 ${theme === 'dark' ? 'bg-[#0e2a4f]' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
        <div className="max-w-6xl mx-auto">
          {/* Header with animation */}
          <div className="relative mb-8">
            <div className={`absolute inset-0 rounded-lg transform -skew-y-1 shadow-lg ${theme === 'dark' ? 'bg-[#a7b4c7] opacity-20' : 'bg-blue-600 opacity-10'}`}></div>
            <div className={`relative p-6 rounded-lg shadow-lg transform transition-all duration-500 hover:shadow-xl ${theme === 'dark' ? 'bg-[#0e2a4f] border border-[#a7b4c7]/30' : 'bg-white border border-blue-100'}`}>
              <h1 className={`text-3xl sm:text-4xl font-bold text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-blue-700'}`}>
                Task Dashboard
              </h1>
              <p className={`text-center mb-2 ${theme === 'dark' ? 'text-[#a7b4c7]' : 'text-gray-500'}`}>Manage your tasks effectively and track your progress</p>
              
              {/* Dashboard Navigation */}
              <div className="flex justify-center mt-6">
                <nav className={`flex space-x-1 rounded-lg p-1 ${theme === 'dark' ? 'bg-[#0e2a4f]/50' : 'bg-gray-100'}`}>
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                      activeTab === "all" 
                        ? theme === 'dark' 
                          ? "bg-[#a7b4c7] text-[#0e2a4f] shadow-sm" 
                          : "bg-white text-blue-700 shadow-sm"
                        : theme === 'dark'
                          ? "text-[#a7b4c7] hover:bg-[#0e2a4f]/80"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("stats")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                      activeTab === "stats" 
                        ? theme === 'dark' 
                          ? "bg-[#a7b4c7] text-[#0e2a4f] shadow-sm" 
                          : "bg-white text-blue-700 shadow-sm"
                        : theme === 'dark'
                          ? "text-[#a7b4c7] hover:bg-[#0e2a4f]/80"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Statistics
                  </button>
                  <button
                    onClick={() => setActiveTab("list")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                      activeTab === "list" 
                        ? theme === 'dark' 
                          ? "bg-[#a7b4c7] text-[#0e2a4f] shadow-sm" 
                          : "bg-white text-blue-700 shadow-sm"
                        : theme === 'dark'
                          ? "text-[#a7b4c7] hover:bg-[#0e2a4f]/80"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    Tasks
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid gap-8">
            {/* Quick Stats Summary */}
            {(activeTab === "all" || activeTab === "stats") && (
              <div 
                className={`transition-all duration-500 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <TaskStats />
              </div>
            )}

            {/* Task List */}
            {(activeTab === "all" || activeTab === "list") && (
              <div 
                className={`transition-all duration-500 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <TaskList 
                  currentTasks={currentTasks} 
                  onTasksUpdate={handleTasksUpdate} 
                />
                
                {/* Pagination Controls */}
                {allTasks.length > tasksPerPage && (
                  <div className={`flex justify-center mt-6 space-x-2 ${
                    theme === 'dark' ? 'text-[#a7b4c7]' : 'text-gray-600'
                  }`}>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1 
                          ? theme === 'dark' 
                            ? 'bg-[#0e2a4f]/50 text-[#a7b4c7]/50 cursor-not-allowed' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : theme === 'dark'
                            ? 'bg-[#0e2a4f]/80 hover:bg-[#a7b4c7] hover:text-[#0e2a4f]'
                            : 'bg-white hover:bg-blue-50 hover:text-blue-700'
                      } transition-colors`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === i + 1
                            ? theme === 'dark'
                              ? 'bg-[#a7b4c7] text-[#0e2a4f] font-bold'
                              : 'bg-blue-600 text-white font-bold'
                            : theme === 'dark'
                              ? 'hover:bg-[#0e2a4f]/80'
                              : 'hover:bg-blue-50'
                        } transition-colors`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                          ? theme === 'dark' 
                            ? 'bg-[#0e2a4f]/50 text-[#a7b4c7]/50 cursor-not-allowed' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : theme === 'dark'
                            ? 'bg-[#0e2a4f]/80 hover:bg-[#a7b4c7] hover:text-[#0e2a4f]'
                            : 'bg-white hover:bg-blue-50 hover:text-blue-700'
                      } transition-colors`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm py-4">
            <p className={theme === 'dark' ? 'text-[#a7b4c7]' : 'text-gray-500'}>© 2025 Task Manager. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
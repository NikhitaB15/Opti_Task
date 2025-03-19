import React, { useState, useEffect } from "react";
import TaskList from "../components/TaskList";
import TaskStats from "../components/TaskStats";
import Chatbot from "../components/Chatbot";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { theme } = useTheme();

  useEffect(() => {
    // Animation delay for initial load
    setIsLoaded(true);
  }, []);

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
                <TaskList />
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
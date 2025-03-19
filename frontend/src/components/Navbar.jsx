import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { useTheme } from "../context/ThemeContext"; 
import React from "react";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (token) {
      getCurrentUser(token)
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, [token, logout]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black text-white py-3 px-6 flex justify-between items-center shadow-lg dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:text-white sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold flex items-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Task Manager</span>
      </Link>
      
      <div className="flex items-center gap-5 relative">
        <button 
          onClick={toggleTheme} 
          className="px-4 py-2 rounded-full bg-gray-800 dark:bg-gray-700 text-white transition-all hover:shadow-md hover:scale-105 flex items-center gap-2"
        >
          {theme === "light" ? (
            <>
              <span className="text-lg">🌙</span>
              <span className="hidden sm:inline">Dark</span>
            </>
          ) : (
            <>
              <span className="text-lg">☀️</span>
              <span className="hidden sm:inline">Light</span>
            </>
          )}
        </button>
        
        {token ? (
          <>
            <span className="text-lg font-semibold hidden md:block">
              Hello, <span className="text-purple-400">{user?.username}</span>
            </span>
            
            <div className="hidden md:flex gap-4">
              <Link to="/dashboard" className="hover:text-blue-400 transition-colors m-1">Dashboard</Link>
              <Link to="/profile" className="hover:text-blue-400 transition-colors m-1">Profile</Link>

              {/* Admin-only Tabs */}
              {user?.role === "admin" && (
                <>
                  <Link to="/admin/users" className="hover:text-blue-400 transition-colors m-1">Manage Users</Link>
                  <Link to="/admin/create-task" className="hover:text-blue-400 transition-colors m-1">Create Task</Link>
                </>
              )}
            </div>

            {/* More Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <span className="hidden sm:inline">Menu</span>
                <span>{isDropdownOpen ? "▲" : "▼"}</span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 dark:bg-gray-800 dark:text-white rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200">
                  <div className="md:hidden border-b border-gray-200 dark:border-gray-700">
                    <Link to="/dashboard" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/profile" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      Profile
                    </Link>
                    
                    {user?.role === "admin" && (
                      <>
                        <Link to="/admin/users" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          Manage Users
                        </Link>
                        <Link to="/admin/create-task" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          Create Task
                        </Link>
                      </>
                    )}
                  </div>
                  
                  <Link to="/settings" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">⚙️</span> Settings
                  </Link>
                  <Link to="/help" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">❓</span> Help
                  </Link>

                  {/* Admin-only option inside dropdown */}
                  {user?.role === "admin" && (
                    <Link to="/admin/reports" className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">📊</span> Admin Reports
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700 flex items-center gap-2"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link 
            to="/login" 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
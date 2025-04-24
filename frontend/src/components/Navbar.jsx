import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { useTheme } from "../context/ThemeContext";
import { FiMoon, FiSun, FiUser, FiSettings, FiHelpCircle, FiLogOut, FiPieChart, FiMessageSquare, FiMenu, FiX } from "react-icons/fi";
import { FaUserCog, FaTasks } from "react-icons/fa";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const closeDropdowns = (e) => {
      if (!e.target.closest(".dropdown-container") && !e.target.closest(".mobile-menu-container")) {
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-3 px-6 flex justify-between items-center shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="flex items-center">
        {/* Mobile menu button */}
        {token && (
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mr-4 md:hidden text-white hover:text-indigo-300 transition-colors"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        )}
        
        <Link to="/" className="text-2xl font-bold flex items-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 hover:from-blue-200 hover:to-purple-200 transition-all">
            OptiTask
          </span>
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full bg-indigo-800 hover:bg-indigo-700 text-white transition-all hover:shadow-md hover:scale-105"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>
        
        {token ? (
          <>
            <div className="hidden lg:flex gap-6">
              <Link 
                to="/dashboard" 
                className="hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <FiPieChart className="inline" /> Dashboard
              </Link>
              <Link 
                to="/profile" 
                className="hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <FiUser className="inline" /> Profile
              </Link>

              {/* Admin-only Tabs */}
              {user?.role === "admin" && (
                <>
                  <Link 
                    to="/admin/users" 
                    className="hover:text-indigo-300 transition-colors flex items-center gap-1"
                  >
                    <FaUserCog className="inline" /> Users
                  </Link>
                  <Link 
                    to="/admin/create-task" 
                    className="hover:text-indigo-300 transition-colors flex items-center gap-1"
                  >
                    <FaTasks className="inline" /> Tasks
                  </Link>
                </>
              )}
            </div>

            {/* User dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-indigo-800 px-3 py-2 rounded-lg transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  {user?.username?.charAt(0).toUpperCase() || <FiUser />}
                </div>
                <span className="hidden lg:inline">{user?.username}</span>
                <span className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>▼</span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 dark:bg-gray-800 dark:text-white rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 transform origin-top">
                  <div className="p-1">
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <FiSettings /> Settings
                    </Link>
                    <Link 
                      to="/help" 
                      className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <FiHelpCircle /> Help Center
                    </Link>

                    {/* Admin options */}
                    {user?.role === "admin" && (
                      <>
                        <Link 
                          to="/admin/reports" 
                          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <FiPieChart /> Reports
                        </Link>
                        <Link 
                          to="/admin/adminchatinterface" 
                          className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <FiMessageSquare /> Admin Chat
                        </Link>
                      </>
                    )}
                    
                    {/* User option */}
                    {user?.role === "user" && (
                      <Link 
                        to="/chat" 
                        className="flex items-center gap-2 px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <FiMessageSquare /> Support
                      </Link>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 p-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <Link 
              to="/login" 
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-indigo-700 hover:bg-gray-100 px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
            >
              Register
            </Link>
          </div>
        )}
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && token && (
        <div className="mobile-menu-container fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="absolute top-16 right-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-in">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  {user?.username?.charAt(0).toUpperCase() || <FiUser />}
                </div>
                <div>
                  <p className="font-medium">{user?.username}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiPieChart /> Dashboard
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiUser /> Profile
              </Link>
              
              {user?.role === "admin" && (
                <>
                  <Link 
                    to="/admin/users" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUserCog /> Manage Users
                  </Link>
                  <Link 
                    to="/admin/create-task" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaTasks /> Create Task
                  </Link>
                </>
              )}
              
              <Link 
                to="/settings" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiSettings /> Settings
              </Link>
              
              {user?.role === "admin" && (
                <Link 
                  to="/admin/adminchatinterface" 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiMessageSquare /> Admin Chat
                </Link>
              )}
              
              {user?.role === "user" && (
                <Link 
                  to="/chat" 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiMessageSquare /> Support
                </Link>
              )}
            </div>
            
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {theme === "light" ? <FiMoon /> : <FiSun />} 
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
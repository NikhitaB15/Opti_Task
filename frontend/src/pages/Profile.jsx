import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiUser, FiMail, FiKey, FiLoader, FiAlertCircle } from "react-icons/fi";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getCurrentUser(token);
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center">
          <FiLoader className="animate-spin text-4xl mb-4 text-blue-500" />
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg bg-red-100 border border-red-200">
          <FiAlertCircle className="text-4xl mb-4 text-red-500" />
          <h3 className="text-xl font-bold text-red-700 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>No user data available</p>
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-all ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col items-center mb-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <FiUser className="text-4xl" />
          </div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Profile</h2>
        </div>

        <div className="space-y-4">
          <div className={`p-4 rounded-lg flex items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FiUser className={`mr-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Username</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{user.username}</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg flex items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FiMail className={`mr-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Email</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{user.email}</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg flex items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FiKey className={`mr-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Role</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
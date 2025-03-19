import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import React from "react";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { token } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    getCurrentUser(token).then((res) => setUser(res.data));
  }, [token]);

  if (!user)
    return <p className="text-center text-xl text-gray-400 dark:text-gray-300">Loading...</p>;

  return (
    <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-[#0e2a4f]' : 'bg-white'}`}>
      <div className={`p-8 rounded-lg shadow-lg text-center w-full max-w-md ${theme === 'dark' ? 'bg-[#a7b4c7]' : 'bg-[#0e2a4f]'}`}>
        <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-[#0e2a4f]' : 'text-white'}`}>Profile</h2>
        <p className={`text-lg ${theme === 'dark' ? 'text-[#0e2a4f]' : 'text-white'}`}>
          <span className="font-semibold">Username:</span> {user.username}
        </p>
        <p className={`text-lg ${theme === 'dark' ? 'text-[#0e2a4f]' : 'text-white'}`}>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className={`text-lg ${theme === 'dark' ? 'text-[#0e2a4f]' : 'text-white'}`}>
          <span className="font-semibold">Role:</span> {user.role}
        </p>
      </div>
    </div>
  );
};

export default Profile;
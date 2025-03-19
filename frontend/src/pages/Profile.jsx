import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import React from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    getCurrentUser(token).then((res) => setUser(res.data));
  }, [token]);

  if (!user)
    return <p className="text-center text-xl text-gray-600">Loading...</p>;

  return (
    <div className="flex justify-center items-center h-screen bg-red-300">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-106">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">Profile</h2>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Username:</span> {user.username}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Role:</span> {user.role}
        </p>
        
      </div>
    </div>
  );
};

export default Profile;

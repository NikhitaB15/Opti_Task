import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Settings = () => {
  const { token } = useAuth();
  const [userSettings, setUserSettings] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Load current user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserSettings({
          username: response.data.username,
          email: response.data.email,
          password: "",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    setUserSettings({ ...userSettings, [e.target.name]: e.target.value });
  };

  // Handle saving settings
  const handleSaveChanges = async () => {
    try {
      const response = await axios.put("http://localhost:8000/update", userSettings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to update settings.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="username"
          value={userSettings.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Username"
        />
        <input
          type="email"
          name="email"
          value={userSettings.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={userSettings.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="New Password"
        />
        <button onClick={handleSaveChanges} className="bg-blue-600 text-white p-2 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;

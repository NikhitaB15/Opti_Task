import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";
import React from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { username, password };
      const response = await loginUser(data);

      login(response.data.access_token);
      toast.success("Login successful!");
      navigate("/dashboard");
      localStorage.setItem("username", username);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div
      className={`flex h-screen items-center justify-center transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0e2a4f]" : "bg-gray-50"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-lg text-center transition-colors duration-300 ${
          theme === "dark" ? "bg-[#a7b4c7]" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 ${
            theme === "dark" ? "text-[#0e2a4f]" : "text-blue-700"
          }`}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 ${
              theme === "dark" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-900"
            }`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 ${
              theme === "dark" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-gray-900"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`w-full p-3 rounded-lg transition duration-300 ${
              theme === "dark"
                ? "bg-[#0e2a4f] text-white hover:bg-[#142b4f]"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

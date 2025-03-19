import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../api/auth";
import { useTheme } from "../context/ThemeContext";

const Register = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "User",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div
      className={`flex h-screen items-center justify-center ${
        theme === "light" ? "bg-[#0e2a4f]" : "bg-white"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-lg text-center ${
          theme === "light" ? "bg-[#a7b4c7]" : "bg-[#0e2a4f]"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 ${
            theme === "light" ? "text-[#0e2a4f]" : "text-white"
          }`}
        >
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              theme === "light" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-white"
            }`}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              theme === "light" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-white"
            }`}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              theme === "light" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-white"
            }`}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
            title="Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character."
            className={`w-full p-3 border rounded-lg ${
              theme === "light" ? "bg-gray-200 text-gray-900" : "bg-gray-100 text-white"
            }`}
          />

          <button
            type="submit"
            className={`w-full p-3 rounded-lg transition duration-300 ${
              theme === "light"
                ? "bg-[#0e2a4f] text-white hover:bg-[#142b4f]"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

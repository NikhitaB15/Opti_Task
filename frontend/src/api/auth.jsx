import axios from "axios";

const API_URL = "http://localhost:8000"; // Change this if needed


export const loginUser = async (credentials) => {
  return axios.post(`${API_URL}/users/token`, credentials, {
    headers: { "Content-Type": "application/json" },
  });
};

export const Chatbot = async (prompt) => {
  try {
    const response = await axios.post(
      `${API_URL}/generate`,
      {
        session_id: "user123", // Fixed or dynamically generated session ID
        prompt: prompt, // Pass the prompt correctly
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // Return response data
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    throw error; // Handle errors properly
  }
};


export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/users/register`, userData);
};

export const getCurrentUser = async (token) => {
  return axios.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getAllUsers = async () => {
  const token = localStorage.getItem("token"); // ✅ Fetch token inside the function
  if (!token) {
    throw new Error("No token found");
  }

  return axios.get(`${API_URL}/users/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


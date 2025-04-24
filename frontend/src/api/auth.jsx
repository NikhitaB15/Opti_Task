import axios from "axios";

const API_URL = "http://localhost:8000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  return { 
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

// User Authentication
export const loginUser = async (credentials) => {
  return axios.post(`${API_URL}/users/token`, credentials, {
    headers: { "Content-Type": "application/json" },
  });
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
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  return axios.get(`${API_URL}/users/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Chat Management

export const createChat = async (token, title, isAdminChat = false) => {
  try {
    if (!token) {
      throw new Error("No token found...........");
    }

    const response = await axios.post(
      `${API_URL}/chats/create`,  
      { title, is_admin_chat: isAdminChat },  
      { headers: { Authorization: `Bearer ${token}` } } 
    );

    return response.data;  //  Await before accessing .data
  } catch (error) {
    console.error("Error creating chat:", error.response?.data || error);
    throw error;
  }
};


// For regular users to get their admin support chat
export const getUserAdminChat = async (token) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/chats/admin`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true, //  Ensure credentials are sent
    });
    console.log("RESPONSE DATA::::::::::::::::",response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin chat:", error.response?.data || error);
    throw error;
  }
};


// For admins to get all support chats
export const getAdminChats = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/chats/admin/all`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      withCredentials: true
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching admin chats:::::", error.response?.data || error);
    throw error;
  }
};

// For admins to get chats with unread messages
export const getPendingChats = async () => {
  try {
    const role=localStorage.getItem("role");
    if (role==="admin")
        {const response = await axios.get(`${API_URL}/chats/admin/pending`, {
      headers: getAuthHeader(),
      withCredentials: true
    });
    return response.data;}
    else
    console.log("role is incorrect................. from pending chats")
  } catch (error) {
    console.error("Error fetching pending chats:", error.response?.data || error);
    throw error;
  }
};

// Send a message to a chat
export const sendMessage = async (chatId, content) => {
  try {
    const response = await axios.post(`${API_URL}/chats/${chatId}/messages`, {
      content
    }, {
      headers: getAuthHeader(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error);
    throw error;
  }
};

// Get messages for a chat
export const getMessages = async (chatId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${API_URL}/chats/${chatId}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true, 
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error.response?.data || error);
    throw error;
  }
};



// Mark messages as read
export const markMessagesAsRead = async (chatId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.post(
      `${API_URL}/chats/${chatId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, //  Necessary for CORS authentication
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error marking messages as read:", error.response?.data || error);
    throw error;
  }
};


// Admin status
export const updateAdminStatus = async (isOnline) => {
  try {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      const response = await axios.patch(
        `${API_URL}/chats/admin/status`, // Ensure correct endpoint
        { is_online: isOnline }, // Sending correct payload
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true, 
        }
      );

      return response.data; // Return response from the server
    } else {
      console.warn("User is not an admin. Status update skipped.");
      return null;
    }
  } catch (error) {
    console.error("Error updating admin status:", error.response?.data || error);
    throw error;
  }
}

// Get admin status
export const getAdminStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/chats/admin/status`, {
      headers: getAuthHeader(),
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin status:", error.response?.data || error);
    throw error;
  }
};

// Chatbot Interaction
export const Chatbot = async (prompt) => {
  try {
    const response = await axios.post(
      `${API_URL}/generate`,
      {
        session_id: "user123",
        prompt: prompt,
      },
      {
        headers: getAuthHeader(),
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching chatbot response:", error.response?.data || error);
    throw error;
  }
};
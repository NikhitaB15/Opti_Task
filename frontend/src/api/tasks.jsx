import axios from "axios";

const API_URL = "http://localhost:8000/tasks";

export const fetchTasks = async (token, filters = {}, page = 1, tasksPerPage = 5) => {
  const params = {
    completed: filters.completed !== null ? filters.completed : undefined,
    priority: filters.priority || undefined,
    sort_by: filters.sortBy || "due_date",
    sort_order: filters.sortOrder || "asc",
    page,
    limit: tasksPerPage,
  };

  
  console.log("Sending API request with params:", params);

  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params, 
  });
};

export const fetchTaskSummary = async (token) => {
  return axios.get(`${API_URL}/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const createTask = async (taskData, token) => {
  return axios.post(API_URL, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteTask = async (taskId, token) => {
  return axios.delete(`${API_URL}/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const markTaskCompleted = async (taskId, token) => {
  return axios.patch(`${API_URL}/${taskId}/complete`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
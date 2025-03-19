import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllUsers } from "../api/auth";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log("API Response:", response);
        setUsers(response.data);
      } catch (error) {
        console.error("Fetch Users Error:", error);

        // Handle unauthorized errors
        if (error.response && error.response.status === 401) {
          toast.error("Unauthorized! Please log in again.");
          localStorage.removeItem("token");
          window.location.href = "/login"; // Redirect to login page
        } else {
          toast.error(error.response?.data?.detail || "Failed to fetch users");
        }
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">All Users</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border">
                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

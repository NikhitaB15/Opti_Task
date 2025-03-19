import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from 'react'
const AdminRoute = () => {
  const { token, user } = useAuth();

  // If no token or user is not an admin, redirect to dashboard
  if (!token || user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

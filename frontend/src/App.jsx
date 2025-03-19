import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; 
import Chatbot from "./components/Chatbot";
import { ThemeProvider } from "./context/ThemeContext"; 
import Register from "./pages/Register";
import AdminUsers from "./components/AdminUsers";
import CreateTask from "./components/CreateTask";
import AdminRoute from "./routes/AdminRoute";
import Help from "./components/Help"
import Settings from "./pages/Settings";
function App() {
  return (
    <AuthProvider>
      <ThemeProvider> 
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chatbot" element={<Chatbot/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/home" element={<Home />} />
            <Route path="/help" element={<Help />} />
            <Route element={<AdminRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/create-task" element={<CreateTask />} />
        </Route>
          </Routes>
        </Router>
      <Chatbot/>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

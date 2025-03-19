import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth";
import React from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState({
    role: localStorage.getItem("role") || "",
    username: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
  });

  useEffect(() => {
    if (token) {
      getCurrentUser(token)
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("email", res.data.email);
        })
        .catch(() => {
          setToken("");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("username");
          localStorage.removeItem("email");
        });
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);

    getCurrentUser(newToken)
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("email", res.data.email);
      })
      .catch(() => {
        setToken("");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
      });
  };

  const logout = () => {
    setToken("");
    setUser({ role: "", username: "", email: "" });
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

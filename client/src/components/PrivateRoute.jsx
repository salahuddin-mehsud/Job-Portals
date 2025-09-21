// src/components/PrivateRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Role not allowed → redirect based on role
    if (user.role === "company") {
      return <Navigate to="/job-posting-creation-management" replace />;
    } else if (user.role === "user") {
      return <Navigate to="/job-seeker-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;

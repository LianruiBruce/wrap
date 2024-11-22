import React from "react";
import { Navigate } from "react-router-dom";

// This component will check for authentication
export default function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp <= currentTime) {
      localStorage.removeItem("token");

      window.postMessage({ type: "USER_LOGOUT" }, "*");

      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Token validation error", error);

    //localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}

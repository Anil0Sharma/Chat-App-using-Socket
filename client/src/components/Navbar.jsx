import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // This clear user from context/localStorage
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-white border-b shadow">
      <h1 className="text-xl font-semibold text-gray-800">💬 Chat App</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 text-sm">
          Logged in as <b>{user?.username}</b>
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

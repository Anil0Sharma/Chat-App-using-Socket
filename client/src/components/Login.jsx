import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      setUser(data);
      navigate("/");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        action=""
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white shadow-md rounded-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Login
        </h2>
        <label className="block mb-2 text-sm text-gray-600">Username</label>
        <input
          type="text"
          name="username"
          onChange={handleChange}
          placeholder="Username"
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <label className="block mb-2 text-sm text-gray-600">Password</label>
        <input
          type="text"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-3 py-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
        <p className="text-sm mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

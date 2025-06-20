import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering");
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
          Register
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
          className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
        <p className="text-sm mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

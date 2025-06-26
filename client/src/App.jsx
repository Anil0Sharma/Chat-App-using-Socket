import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ChatList from "./components/ChatList";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const { user } = useAuth();

  //if user is logged in then nav to homepage else to login
  return user ? children : <Navigate to="/login" />;
}

function Homepage() {
  return (
    <>
      <Navbar />
      <ChatList />
    </>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Homepage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

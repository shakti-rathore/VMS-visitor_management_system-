import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts
import Admin from "layouts/Admin.js";
import Receptionist from "layouts/Receptionist.js"; // Receptionist layout
import Login from "layouts/Login";

// views without layouts
import Profile from "views/Profile.js";
import Index from "views/Index.js";

// Helper function to check the user's role
const getRole = () => {
  return localStorage.getItem('role');
};

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      {/* Protected Admin Routes */}
      <Route 
        path="/admin/*" 
        element={getRole() === 'host' ? <Admin /> : <Navigate to="/" />} 
      />

      {/* Receptionist Route */}
      <Route 
        path="/receptionist/*" 
        element={getRole() === 'receptionist' ? <Receptionist /> : <Navigate to="/" />} 
      />

      {/* Login Route */}
      <Route path="/" element={<Login />} />

      {/* Other Routes */}
      <Route path="/profile" element={<Profile />} />

      {/* Fallback Route to Login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);

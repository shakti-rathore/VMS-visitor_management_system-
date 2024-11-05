// App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// Layouts and Pages
import Admin from "layouts/Admin.js";
import Receptionist from "layouts/Receptionist.js";
import Login from "layouts/Login";
import Profile from "views/Profile.js";

// Authentication helper
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return token && role ? role : null;
};

const App = () => {
  return (
    <Routes>
      {/* Protected Admin Routes */}
      <Route 
        path="/admin/*" 
        element={isAuthenticated() === 'host' ? <Admin /> : <Navigate to="/" />} 
      />

      {/* Protected Receptionist Route */}
      <Route 
        path="/receptionist/*" 
        element={isAuthenticated() === 'receptionist' ? <Receptionist /> : <Navigate to="/" />} 
      />

      {/* Login Route */}
      <Route path="/" element={<Login />} />

      {/* Other Routes */}
      <Route path="/profile" element={<Profile />} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;

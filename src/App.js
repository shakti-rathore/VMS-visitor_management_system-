import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// Layouts and Pages
import Admin from "layouts/Admin.js";
import Receptionist from "layouts/Receptionist.js";
import Login from "layouts/Login";
import Profile from "views/Profile.js";

// Authentication helper
const getRole = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return token && role ? role : null;
};

const App = () => {
  const role = getRole();
  const location = useLocation();

  // Ensure authenticated access only to the correct routes
  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/"
        element={role ? <Navigate to={`/${role === 'host' ? 'admin' : 'receptionist'}/dashboard`} /> : <Login />}
      />

      {/* Admin Routes */}
      {role === 'host' && (
        <Route path="/admin/*" element={<Admin />} />
      )}

      {/* Receptionist Routes */}
      {role === 'receptionist' && (
        <Route path="/receptionist/*" element={<Receptionist />} />
      )}

      {/* Fallback Route to Handle Unauthorized Access */}
      <Route
        path="*"
        element={<Navigate to={role ? `/${role === 'host' ? 'admin' : 'receptionist'}/dashboard` : "/"} replace />}
      />
    </Routes>
  );
};

export default App;

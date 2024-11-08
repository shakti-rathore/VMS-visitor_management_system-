// Admin.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// Views
import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <div className="mx-auto w-full">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="maps" element={<Maps />} />
            <Route path="settings" element={<Settings />} />
            <Route path="tables" element={<Tables />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}

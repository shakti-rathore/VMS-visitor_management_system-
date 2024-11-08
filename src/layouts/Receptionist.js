// Receptionist.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebarrecep/Sidebar";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// Views
import Dashboardrecp from "views/receptionist/Dashboardrecp.js";
import Mapsrecp from "views/receptionist/Mapsrecp.js";
import Settingsrecp from "views/receptionist/Settingsrecp.js";
import Tablesrecp from "views/receptionist/Tablesrecp.js";

export default function Receptionist() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <div className="mx-auto w-full">
          <Routes>
            <Route path="dashboardrecp" element={<Dashboardrecp />} />
            <Route path="mapsrecp" element={<Mapsrecp />} />
            <Route path="settingsrecp" element={<Settingsrecp />} />
            <Route path="tablesrecp" element={<Tablesrecp />} />
            <Route path="*" element={<Navigate to="dashboardrecp" replace />} />
          </Routes>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}

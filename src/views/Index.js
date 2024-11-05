import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Change to useNavigate

export default function Index() {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

 useEffect(() => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
 if(token){
  if (role === 'host') {
    navigate("/admin/dashboard");
  } else if (role === 'receptionist') {
    navigate("/receptionist/dashboardrecp");
  }
 }
 else {
    navigate("/login");
  }
}, [navigate]);

  return null; // You can return a loading spinner or null
}

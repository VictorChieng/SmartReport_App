import React, { useState,useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ASidebar2 from "./ASidebar2";
import Report2 from "./report2";

import './report.css'

export default function AgentDashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();


  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  useEffect(() => {
    if (!currentUser) {
      // If the user is not authenticated (e.g., User B), redirect them to the login page.
      history.push("/login"); // Update the path to the appropriate login page
    }
  }, [currentUser, history]);

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/");
    } catch {
      setError("Failed to log out");
    }
  }



  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <ASidebar2 openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Report2 />
    </div>
  )
}




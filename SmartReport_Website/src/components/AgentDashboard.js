import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ASidebar2 from "./ASidebar2";
import Report2 from "./report2";
import './report.css'

// AgentDashboard component for displaying agent-specific functionalities
export default function AgentDashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();   // Authentication functions and current user data from AuthContext
  const history = useHistory();   // History hook for programmatic navigation

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)   // State variable and function to toggle the sidebar

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  // Effect hook to check if the user is authenticated; if not, redirect to the login page
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




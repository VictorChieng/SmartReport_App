import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Reportm4 from "./reportm4";

import './report.css'



export default function CompletedReport() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  
  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Reportm4 />
    </div>
  )
}

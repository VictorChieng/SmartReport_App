import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ASidebar2 from "./ASidebar2";
import Areport5 from "./Areport5";

import './report.css'



export default function ATaskAssigned() {
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
      <ASidebar2 openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Areport5 />
    </div>
  )
}

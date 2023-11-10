import React, { useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export default function AdminDashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/")
    } catch {
      setError("Failed to log out")
    }
  }

  
  return (
    <div className="container">
      <Card style={{ backgroundColor: '#433E7A', color: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '15px', padding: '20px' }}>
        <Card.Body>
          <h2 className="text-center mb-4" style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '32px' }}>Admin Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="d-flex flex-column align-items-center">
            <div className="my-3">
              <strong>Email:</strong> {currentUser.email}
            </div>
            <div className="my-2">
              <Link to="/update-profile" className="btn btn-primary rounded-pill">
                Update Password
              </Link>
            </div>
            <div className="my-2">
              <Link to="/signup" className="btn btn-primary rounded-pill">
                Sign Up New User
              </Link>
            </div>
            <div className="my-2">
              <Link to="/UserManagement" className="btn btn-primary rounded-pill">
                User Management
              </Link>
            </div>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-3">
        <Button variant="link" onClick={handleLogout} style={{ color: 'blue', textDecoration: 'underline', fontSize: '16px', fontWeight: 'bold' }}>
          Log Out
        </Button>
      </div>
    </div>
  );
}

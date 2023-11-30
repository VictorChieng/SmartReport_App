import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"

// Functional component for handling password reset
export default function ForgotPassword() {
  // References and state variables for form elements and feedback
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Function to handle form submission
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      // Reset feedback messages and set loading state
      setMessage("")
      setError("")
      setLoading(true)

      // Call the resetPassword function with the provided email
      await resetPassword(emailRef.current.value)
      // Display success message if the password reset is successful
      setMessage("Check your inbox for further instructions")
    } catch {
      // Display an error message if password reset fails
      setError("Failed to reset password")
    }

    setLoading(false)
  }
  return (
    <>
      <Card style={{ backgroundColor: '#433E7A', color: 'white' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button
              style={{ backgroundColor: '#FF705A', color: 'white' }}
              disabled={loading}
              className="w-100"
              type="submit"
            >
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/" style={{ color: 'white' }}>
              Back to login?
            </Link>
          </div>
        </Card.Body>
      </Card>

    </>
  )
}

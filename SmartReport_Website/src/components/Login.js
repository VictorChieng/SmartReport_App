import React, { useRef, useState, useEffect, useCallback } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";
import logo from "./logo.png";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();  // Authentication functions from AuthContext
  const [error, setError] = useState("");  // State variables for error handling and loading state
  const [loading, setLoading] = useState(false);
  const history = useHistory();  // Navigation history hook
  const db = firebase.firestore();   // Firestore database reference


  // Function to check user role and redirect based on the role
  const checkUserRoleAndRedirect = useCallback(async (user) => {
    try {
      // Fetch user data from Firestore
      const userDoc = await db.collection("users").doc(user.uid).get();
      const userData = userDoc.data();

      // Check if user data and role exist
      if (userData && userData.role) {
        const role = userData.role;

        console.log(`User's role: ${role}`);

        // Redirect based on user role
        switch (role) {
          case "admin":
            history.push("/AdminDashboard");
            break;
          case "manager":
            history.push("/ManagerDashboard");
            break;
          case "agent":
            history.push("/AgentDashboard");
            break;
          default:
            setError("Login failed: Invalid Role Access");
        }
      }
    } catch (error) {
      console.error("Error checking user role:", error.message);
    }
  }, [db, history]);

  // Effect hook to listen to changes in authentication state
  useEffect(() => {
    // Set up an authentication state change listener
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // If a user is authenticated, check their role and redirect
        checkUserRoleAndRedirect(user);
      }
    });

    // Cleanup function to unsubscribe from the authentication state listener
    return () => unsubscribe();
  }, [checkUserRoleAndRedirect]);

  // Function to handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Reset error and set loading state
      setError("");
      setLoading(true);
      // Attempt to log in the user
      const userCredential = await login(
        emailRef.current.value,
        passwordRef.current.value
      );
      const user = userCredential.user;
      // Check user role and redirect
      checkUserRoleAndRedirect(user);
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Failed to log in. Please check your credentials.");
    } finally {
      // Reset loading state
      setLoading(false);
    }
  }

  // Render the login form
  return (
    <>
      <Card style={{ backgroundColor: '#433E7A', color: 'white' }}>
        <Card.Body>
          <div className="text-center">
            <img src={logo} alt="Logo" style={{ width: "100px" }} />
            <h2 className="mb-4">Log In</h2>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button
              style={{ backgroundColor: '#FF705A', color: 'white' }}
              disabled={loading}
              className="w-100"
              type="submit"
            >
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password" style={{ color: 'white' }}>
              Forgot Password?
            </Link>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}


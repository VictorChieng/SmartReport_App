import React, { useRef, useState, useEffect, useCallback } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";
import logo from "./logo.png";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const db = firebase.firestore();

  const checkUserRoleAndRedirect = useCallback(async (user) => {
    try {
      const userDoc = await db.collection("users").doc(user.uid).get();
      const userData = userDoc.data();

      if (userData && userData.role) {
        const role = userData.role;

        console.log(`User's role: ${role}`);

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

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        checkUserRoleAndRedirect(user);
      }
    });

    return () => unsubscribe();
  }, [checkUserRoleAndRedirect]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const userCredential = await login(
        emailRef.current.value,
        passwordRef.current.value
      );
      const user = userCredential.user;

      checkUserRoleAndRedirect(user);
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

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


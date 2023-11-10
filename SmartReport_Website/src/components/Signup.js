import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const departmentRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [previousPage, setPreviousPage] = useState(null);

  function generatePassword() {
    const passwordLength = 16;
    const chars = [...Array(75).keys()].map((x) => String.fromCharCode(x + 48));
    const numbers = new Uint32Array(passwordLength);
    window.crypto.getRandomValues(numbers);
    return Array.from(numbers)
      .map((x) => chars[x % 75])
      .join("");
  }

  function handleGeneratePasswordClick() {
    const generatedPassword = generatePassword();
    passwordRef.current.value = generatedPassword;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setErrorMessage("");
      setLoading(true);

      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const role = roleRef.current.value;
      const name = nameRef.current.value;
      const phoneNumber = phoneNumberRef.current.value;
      const department = departmentRef.current.value;

      const response = await axios.post("http://localhost:3001/createUser", {
        email,
        password,
        role,
        name,
        phoneNumber,
        department,
      });

      if (response.status === 200) {
        setErrorMessage("");
        alert("Sign-up successful!");
        if (previousPage) {
          history.push(previousPage);
        } else {
          history.push("/");
        }
      } else {
        setErrorMessage("Failed to create an account. Please try again later.");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("The password is too weak.");
      } else if (error.code === "auth/email-already-in-use") {
        setErrorMessage("The email address is already in use.");
      } else {
        setErrorMessage("Failed to create an account. Please try again.");
      }
    }

    setLoading(false);
  }

  history.listen((location, action) => {
    if (action === "PUSH") {
      setPreviousPage(location.pathname);
    }
  });

  return (
    <Card style={{ backgroundColor: '#433E7A', color: 'white' }}>
      <Card.Body>
        <h2 className="text-center mb-4">Sign Up</h2>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group id="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={nameRef} required />
          </Form.Group>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>
          <Form.Group id="phoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="tel" ref={phoneNumberRef} required />
          </Form.Group>
          <Form.Group id="department">
            <Form.Label>Department</Form.Label>
            <Form.Control type="text" ref={departmentRef} required />
          </Form.Group>
          <Form.Group id="password" className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} required />
          </Form.Group>
          <Form.Group id="generate-password">
            <Button style={{ backgroundColor: '#FF705A', color: 'white' }} className="w-100 mb-2" onClick={handleGeneratePasswordClick}>
              Generate Password
            </Button>
          </Form.Group>
          <Form.Group id="role" className="mb-2">
            <Form.Label>User Role</Form.Label>
            <Form.Control as="select" ref={roleRef} required>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="agent">Agent</option>
              <option value="user">User</option>
            </Form.Control>
          </Form.Group>
          <Button style={{ backgroundColor: '#FF705A', color: 'white' }} disabled={loading} className="w-100" type="submit">
            Sign up
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}



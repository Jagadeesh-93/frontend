import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Home } from "lucide-react";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // Add error state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Reset error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        formData
      );
      // Store token and user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert(response.data.message);
      navigate("/mainpage");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage); // Display error to user
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Log In</h2>
        <p>
          <b>Welcome to Happy Homes!</b> <br />
          <sub><b>Your Perfect Stay, Just a Click Away.</b></sub>
        </p>
        {error && <p className="error">{error}</p>} {/* Display error */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            className="input-field"
            placeholder="Enter Username"
            onChange={handleChange}
            value={formData.username}
            required
          />
          <input
            type="password"
            name="password"
            className="input-field"
            placeholder="Enter Password"
            onChange={handleChange}
            value={formData.password}
            required
          />
          <button type="submit" className="login-btn">
            Log In
            {[...Array(6)].map((_, i) => (
              <Home
                key={i}
                className="home-icon"
                style={{
                  left: "-40px",
                  transform: `rotate(${Math.random() * 360}deg) scale(${0.7 + Math.random() * 0.5})`,
                }}
              />
            ))}
          </button>
        </form>
        <Link to="/forgot-password" className="forgot-password">
          Forgot Password?
        </Link>
        <Link to="/register" className="signup-link">
          Don't have an account? Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
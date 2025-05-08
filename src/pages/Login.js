import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Home } from "lucide-react"; // Correct import
import "./Login.css"; // Import CSS file

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      alert(response.data.message);
      localStorage.setItem("token", response.data.token);
      navigate("/mainpage");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      {/* Login box */}
      <div className="login-box">
        <h2>Log In</h2>
        <p>
          <b>Welcome to Happy Homes!</b> <br />
          <sub><b>Your Perfect Stay, Just a Click Away.</b></sub>
        </p>

        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="username" 
            className="input-field" 
            placeholder="Enter Username" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            className="input-field" 
            placeholder="Enter Password" 
            onChange={handleChange} 
            required 
          />

          {/* Login Button with Floating Home Icons */}
          <button type="submit" className="login-btn">
            Log In
            {[...Array(6)].map((_, i) => (
              <Home
                key={i}
                className="home-icon"
                style={{
                  left: "-40px", // Start from outside the button
                  transform: `rotate(${Math.random() * 360}deg) scale(${0.7 + Math.random() * 0.5})`, // Random rotation & size
                }}
              />
            ))}
          </button>
        </form>
        <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
        <Link to="/register" className="signup-link">Don't have an account? Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
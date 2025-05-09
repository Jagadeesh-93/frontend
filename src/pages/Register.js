import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "./AuthStyles.css";

// Debounce function to limit API calls
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkingUsername] = useState(false); // No longer needed, but kept to avoid UI changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Reset errors when user starts typing
    if (name === "username") {
      setUsernameError("");
    }
    if (name === "password") {
      setPasswordError("");
    }
  };

  // Client-side username validation
  const validateUsernameFormat = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!username) {
      return "Username is required.";
    }
    if (username.length < 3) {
      return "Username must be at least 3 characters long.";
    }
    if (!usernameRegex.test(username)) {
      return "Username can only contain letters, numbers, and underscores.";
    }
    return "";
  };

  // Function to check username availability (API call disabled due to missing endpoint)
  const checkUsernameAvailability = useCallback(async (username) => {
    // Temporarily disabled until /check-username endpoint is added to backend
    /*
    setCheckingUsername(true);
    try {
      const response = await axios.post("http://localhost:5000/api/users/check-username", {
        username,
      });

      if (response.data.exists) {
        setUsernameError("Username already taken. Try another one.");
      } else {
        setUsernameError("");
      }
    } catch (error) {
      console.error("Username check failed:", error);
      if (error.response) {
        setUsernameError("Server error: " + (error.response.data.message || "Unable to check username."));
      } else if (error.request) {
        setUsernameError("Network error: Unable to reach the server.");
      } else {
        setUsernameError("Error checking username.");
      }
    } finally {
      setCheckingUsername(false);
    }
    */
    // For now, rely on client-side validation only
    setUsernameError(""); // Clear any previous errors
  }, []); // No dependencies since the function doesn't use external state/props

  // Debounced version of checkUsernameAvailability
  const debouncedCheckUsername = useCallback(
    debounce(checkUsernameAvailability, 500),
    [checkUsernameAvailability]
  );

  // Effect to validate username and trigger API check
  useEffect(() => {
    const username = formData.username;
    const formatError = validateUsernameFormat(username);
    if (formatError) {
      setUsernameError(formatError);
    } else {
      debouncedCheckUsername(username);
    }
  }, [formData.username, debouncedCheckUsername]); // Added debouncedCheckUsername to the dependency array

  // Function to validate password
  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle registration submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usernameError || checkingUsername) {
      alert("Please resolve username issues before proceeding.");
      return;
    }

    if (!isValidPassword(formData.password)) {
      setPasswordError(
        "Password must have at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      );
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
      alert(response.data.message);
      window.location.href = "/"; // Navigate to login page after successful registration
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <FaHome className="home-icon" onClick={() => (window.location.href = "/")} />
      <div className="auth-container">
        <h2>Register</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
          <div className="input-wrapper">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />
            {checkingUsername && <span className="loading">Checking...</span>}
          </div>
          {usernameError && <p className="error">{usernameError}</p>}
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          {passwordError && <p className="error">{passwordError}</p>}
          <button type="submit">
            Register
            {[...Array(6)].map((_, i) => (
              <FaHome key={i} className="home-icon" />
            ))}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
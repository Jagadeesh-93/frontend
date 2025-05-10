import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import "./AuthStyles.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const fromProfile = location.state?.fromProfile || false;

  // Check for reset token in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get("token");
    if (resetToken) {
      setToken(resetToken);
    } else if (!fromProfile) {
      setError("No reset token found in the URL. Please request a new reset link.");
    }
    console.log("Reset token from URL:", resetToken);
  }, [location, fromProfile]);

  // Handle forgot password (send reset link)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      alert(res.data.message);
    } catch (error) {
      console.error("Forgot Password Error:", error.response?.data);
      setError("Error sending reset link: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  // Handle password change (update password from profile)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to change your password.");
        navigate("/");
        return;
      }
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/change-password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message);
      navigate("/profile");
    } catch (error) {
      console.error("Change Password Error:", error.response?.data);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Session expired. Please log in again.");
        navigate("/");
      } else {
        setError("Error changing password: " + (error.response?.data?.message || "Unknown error"));
      }
    }
  };

  // Handle password reset (using token from email link)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    console.log("Submitting reset request with:", { token, newPassword });

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
        token,
        newPassword,
      });
      alert(res.data.message);
      navigate("/");
    } catch (error) {
      console.error("Reset Password Error:", error.response?.data);
      setError("Error resetting password: " + (error.response?.data?.message || "Invalid or expired reset token"));
    }
  };

  return (
    <div className="auth-page">
      <FaHome className="home-icon" onClick={() => navigate("/mainpage")} />
      <div className="auth-container">
        <h2>
          {token ? "Reset Password" : fromProfile ? "Change Password" : "Forgot Password"}
        </h2>
        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
        <form
          className="auth-form"
          onSubmit={
            token ? handleResetPassword : fromProfile ? handleChangePassword : handleForgotPassword
          }
        >
          {token ? (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit">
                Reset Password
                {[...Array(6)].map((_, i) => (
                  <FaHome key={i} className="home-icon" />
                ))}
              </button>
            </>
          ) : fromProfile ? (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit">
                Update Password
                {[...Array(6)].map((_, i) => (
                  <FaHome key={i} className="home-icon" />
                ))}
              </button>
            </>
          ) : (
            <>
              <input
                type="email"
                placeholder="Enter Registered Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">
                Send Reset Link
                {[...Array(6)].map((_, i) => (
                  <FaHome key={i} className="home-icon" />
                ))}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNav from "../components/BottomNav";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const username = userData.username;

        if (!token || !username) {
          console.log("No token or username found, redirecting to login");
          setError("Please log in to view your profile.");
          navigate("/");
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            username, // Pass username as a query parameter
          },
        });
        setUser(response.data);
        setError("");
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response) {
          console.log("Error response:", error.response.status, error.response.data);
          if (error.response.status === 401 || error.response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setError("Session expired or invalid token. Please log in again.");
            navigate("/");
          } else if (error.response.status === 404) {
            setError("User not found. Please register or log in again.");
            navigate("/");
          } else {
            setError("Failed to load profile. Please try again later.");
            navigate("/");
          }
        } else {
          setError("Failed to connect to the server. Please check your network or try again later.");
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChangePassword = () => {
    navigate("/forgot-password", { state: { fromProfile: true } });
  };

  if (!user && !error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">👤 Profile</h1>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-4 text-center">
          <h2 className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-600">Email: {user.email}</p>
          <button
            onClick={handleChangePassword}
            className="mt-4 bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
          >
            Change Password
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default ProfilePage;
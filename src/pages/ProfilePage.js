import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNav from "../components/BottomNav";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response) {
          console.log("Error response:", error.response.status, error.response.data);
          if (error.response.status === 401 || error.response.status === 403) {
            localStorage.removeItem("token");
            alert("Session expired or invalid token. Please log in again.");
            navigate("/login");
          } else if (error.response.status === 404) {
            alert("User not found. Please register or log in again.");
            navigate("/login");
          } else {
            alert("Failed to load profile. Please try again later.");
            navigate("/login");
          }
        } else {
          alert("Failed to connect to the server. Please check if the backend is running.");
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChangePassword = () => {
    navigate("/forgot-password", { state: { fromProfile: true } });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold">👤 Profile</h1>
      

      <div className="bg-white p-6 rounded-lg shadow-md mt-4 text-center">
         
        <h2 className="text-xl font-semibold">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-600">Email: {user.email}</p>
        <button
          onClick={handleChangePassword}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Change Password
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

export default ProfilePage;
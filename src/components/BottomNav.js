import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBuilding, FaPlusCircle, FaUser } from "react-icons/fa"; // Correct import
import './BottomNav.css';  // Import the custom CSS

const BottomNav = () => {
  return (
    <div className="bottom-nav">
      <Link to="/mainpage" className="nav-link">
        <FaHome size={24} />
        <span className="text-xs">Home</span>
      </Link>
      <Link to="/hostel" className="nav-link">
        <FaBuilding size={24} />
        <span className="text-xs">Hostel</span>
      </Link>
      <Link to="/upload" className="nav-link">
        <FaPlusCircle size={24} className="text-green-500" />
        <span className="text-xs">Upload</span>
      </Link>
      <Link to="/profile" className="nav-link">
        <FaUser size={24} />
        <span className="text-xs">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNav;
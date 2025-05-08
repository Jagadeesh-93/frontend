import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import BottomNav from "../components/BottomNav";
import "./MainPage.css";

function FavouritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshFavorites();
  }, []);

  const refreshFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  };

  const handleRemoveFavorite = (propertyId) => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const updatedFavorites = storedFavorites.filter((fav) => fav._id !== propertyId);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("userLocation");
    localStorage.removeItem("token");
    localStorage.removeItem("locationPromptHandled");
    navigate("/");
  };

  const toggleMenu = () => {
    console.log("Toggling menu, showMenu was:", showMenu);
    setShowMenu(!showMenu);
  };

  const handleMenuOption = (option) => {
    setShowMenu(false);
    if (option === "logout") {
      handleLogout();
    } else if (option === "favourites") {
      navigate("/favourites");
    } else if (option === "settings") {
      navigate("/profile");
    }
  };

  return (
    <div className="container my-4">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img src="/logo.png" alt="Logo" className="logo" />
            <div className="header-title">
              <h4>Happy</h4>
              <h4>Homes</h4>
            </div>
          </div>
          <div className="logout-container">
            <button onClick={toggleMenu} className="menu-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => handleMenuOption("favourites")}
                >
                  Favourites
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => handleMenuOption("settings")}
                >
                  Settings
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => handleMenuOption("logout")}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <hr className="header-divider" />

      <div>
        <h2 className="fw-bold mt-4">Your Favourites</h2>
        <div className="row">
          {favorites.length > 0 ? (
            favorites.map((property) => (
              <div key={property._id} className="col-md-4 mb-4 position-relative">
                <PropertyCard property={property} onFavoriteChange={refreshFavorites} />
                <button
                  className="remove-btn position-absolute top-0 end-0 m-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(property._id);
                  }}
                  style={{ background: "none", border: "none" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="red"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="text-muted">
              <p>No favorites added yet.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default FavouritesPage;
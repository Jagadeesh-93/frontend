import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function PropertyCard({ property }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isFav = storedFavorites.some((fav) => fav._id === property._id);
    setIsFavorite(isFav);
  }, [property._id]);

  const toggleFavorite = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = storedFavorites.filter((fav) => fav._id !== property._id);
    } else {
      updatedFavorites = [...storedFavorites, property];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    navigate(`/property/${property._id}`);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? (property.images?.length || 1) - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === (property.images?.length || 1) - 1 ? 0 : prevIndex + 1
    );
  };

  const imageUrl = property.images && property.images.length > 0
    ? `http://localhost:5000${property.images[currentImageIndex]}`
    : "https://via.placeholder.com/300";

  return (
    <div className="card p-3 shadow property-card" onClick={handleCardClick} style={{ fontFamily: "'Roboto', sans-serif" }}>
      <div className="image-slider" style={{ position: "relative" }}>
        <img src={imageUrl} alt={property.title} className="property-image" />
        {property.images && property.images.length > 1 && (
          <>
            <button className="prev" onClick={handlePrevImage}>
              &lt;
            </button>
            <button className="next" onClick={handleNextImage}>
              &gt;
            </button>
          </>
        )}
        <button
          className={`heart-icon ${isFavorite ? "favorited" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isFavorite ? "black" : "none"}
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="card-body">
        <h5 className="card-title">{property.title}</h5>
        <p className="text-dark">
          <strong>Location:</strong> {property.location}
        </p>
        {property.type === "hostel" && (
          <>
            <p className="text-dark">
              <strong>Shared By:</strong> {property.hostelDetails?.sharedBy || "Not specified"}
            </p>
            <p
              className="text-dark"
              style={{
                whiteSpace: "normal",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              <strong>Facilities:</strong>{" "}
              {property.hostelDetails?.facilities
                ? [
                    property.hostelDetails.facilities.food && "Food",
                    property.hostelDetails.facilities.wifi && "WiFi",
                    property.hostelDetails.facilities.transport && "Transport",
                    property.hostelDetails.facilities.laundry && "Laundry",
                  ]
                    .filter(Boolean)
                    .join(", ") || "None"
                : "Not specified"}
            </p>
          </>
        )}
        {property.type === "home" && (
          <>
            <p className="text-dark">
              <strong>Facing:</strong> {property.homeDetails?.facing || "Not specified"}
            </p>
            <p className="text-dark">
              <strong>Floor:</strong> {property.homeDetails?.floor || "Not specified"}
            </p>
            <p className="text-dark">
              <strong>Carpet Area:</strong> {property.homeDetails?.carpetArea || "Not specified"}
            </p>
            <p className="text-dark">
              <strong>Parking:</strong>{" "}
              {property.homeDetails?.parking
                ? [
                    property.homeDetails.parking.car && "Car",
                    property.homeDetails.parking.bike && "Bike",
                  ]
                    .filter(Boolean)
                    .join(", ") || "None"
                : "Not specified"}
            </p>
          </>
        )}
        <p className="text-dark">
          <strong>Owner Name:</strong> {property.owner?.name || "Not specified"}
        </p>
        <p className="text-dark">
          <strong>Owner Contact:</strong> {property.owner?.contact || "Not specified"}
        </p>
        <p className="price">
          ₹{property.price}/-
        </p>
      </div>
    </div>
  );
}

export default PropertyCard;
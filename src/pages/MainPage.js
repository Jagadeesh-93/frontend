import React, { useState, useEffect, Component } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BottomNav from "../components/BottomNav";
import PropertyCard from "../components/PropertyCard";
import "../pages/MainPage.css";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Error: {this.state.error.message}</h1>;
    }
    return this.props.children;
  }
}

function MainPage() {
  const [, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const promptHandled = localStorage.getItem("locationPromptHandled");
    if (promptHandled) {
      const storedLocation = JSON.parse(localStorage.getItem("userLocation"));
      if (storedLocation) {
        setLocation(storedLocation);
        getCityName(storedLocation.lat, storedLocation.lng);
      }
    } else {
      setShowPrompt(true);
    }
  }, []);

  useEffect(() => {
    if (city) {
      fetchHomes(city);
    }
  }, [city]);

  const handleAgree = () => {
    setShowPrompt(false);
    localStorage.setItem("locationPromptHandled", "true");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation);
          localStorage.setItem("userLocation", JSON.stringify(userLocation));
          getCityName(userLocation.lat, userLocation.lng);
        },
        () => {
          alert("Location access denied. Redirecting to login.");
          localStorage.setItem("locationPromptHandled", "true");
          navigate("/");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      localStorage.setItem("locationPromptHandled", "true");
      navigate("/");
    }
  };

  const handleDisagree = () => {
    alert("Location access is required. Redirecting to login.");
    localStorage.setItem("locationPromptHandled", "true");
    navigate("/");
  };

  const getCityName = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            "User-Agent": "HappyHomesApp/1.0 (your-email@example.com)",
          },
        }
      );
      const extractedCity =
        response.data.address.city ||
        response.data.address.town ||
        response.data.address.village ||
        "Unknown";

      setCity(extractedCity.trim());
      setSearchedCity(extractedCity.trim());
    } catch (error) {
      console.error("❌ Error fetching city name:", error);
      setCity("Unknown");
      setSearchedCity("Unknown");
    } finally {
      setLoading(false);
    }
  };

  const fetchHomes = async (searchCity) => {
    if (!searchCity) return;
    try {
      setLoading(true);
      const formattedCity = searchCity.charAt(0).toUpperCase() + searchCity.slice(1).toLowerCase();
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to view properties.");
        navigate("/");
        return;
      }
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties?location=${formattedCity}&type=home`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Full API Response:", res.data);

      const homesArray = res.data.properties || [];
      if (!Array.isArray(homesArray)) {
        throw new Error("Invalid API response format - Expected an array under 'properties'");
      }

      const homesWithImages = homesArray.map((home) => ({
        ...home,
        images: home.images.map((img) => `${process.env.REACT_APP_API_URL}${img}`) || [],
      }));

      setHomes(homesWithImages);
    } catch (error) {
      console.error("❌ Error fetching homes:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired. Please log in again.");
        navigate("/");
      } else {
        setHomes([]);
      }
    } finally {
    setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setSearchedCity(searchQuery.trim());
      fetchHomes(searchQuery.trim());
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

  console.log("Rendering, showMenu is:", showMenu);

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
          <div className="search-container">
            <div className="box">
              <button className="search-btn-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              <input
                type="text"
                className="input"
                name="txt"
                placeholder="Enter a city name "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
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

      {showPrompt ? (
        <div className="card p-4 text-center location-prompt">
          <h2 className="fw-bold">Allow Location Access</h2>
          <p className="text-muted">We need your location to show nearby rentals.</p>
          <div className="mt-3">
            <button onClick={handleAgree} className="btn btn-dark me-2">
              Agree
            </button>
            <button onClick={handleDisagree} className="btn btn-dark">
              Disagree
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="fw-bold mt-4">Available Homes in {searchedCity}</h2>
          <div className="row">
            {loading ? (
              <div className="text-center">
                <div className="spinner"></div>
                <p className="text-primary">Loading properties...</p>
              </div>
            ) : homes.length > 0 ? (
              homes.map((home) => (
                <div key={home._id} className="col-md-4 mb-4">
                  <div className="image-slider position-relative">
                    <PropertyCard property={home} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted">
                <p>No homes found in {searchedCity}.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function WrappedMainPage() {
  return (
    <ErrorBoundary>
      <MainPage />
    </ErrorBoundary>
  );
}
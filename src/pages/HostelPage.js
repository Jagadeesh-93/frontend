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

function HostelPage() {
  const [, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const [hostels, setHostels] = useState([]);
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
      } else {
        navigate("/mainpage");
      }
    } else {
      navigate("/mainpage");
    }
  }, []);

  useEffect(() => {
    if (city) {
      fetchHostels(city);
    }
  }, [city]);

  const getCityName = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
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

  const fetchHostels = async (searchCity) => {
    if (!searchCity) return;
    try {
      setLoading(true);
      const formattedCity = searchCity.charAt(0).toUpperCase() + searchCity.slice(1).toLowerCase();
      const res = await axios.get(`http://localhost:5000/api/properties?location=${formattedCity}&type=hostel`);
      console.log("✅ Hostel API Response:", res.data);

      const hostelsArray = res.data.properties || [];
      if (!Array.isArray(hostelsArray)) {
        throw new Error("Invalid API response format - Expected an array under 'properties'");
      }

      const hostelsWithImageIndex = hostelsArray.map((hostel) => ({
        ...hostel,
        images: hostel.images || [],
      }));

      setHostels(hostelsWithImageIndex);
    } catch (error) {
      console.error("❌ Error fetching hostels:", error);
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setSearchedCity(searchQuery.trim());
      fetchHostels(searchQuery.trim());
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

      <div>
        <h2 className="fw-bold mt-4">Available Hostels in {searchedCity}</h2>
        <div className="row">
          {loading ? (
            <div className="text-center">
              <div className="spinner"></div>
              <p className="text-primary">Loading properties...</p>
            </div>
          ) : hostels.length > 0 ? (
            hostels.map((hostel) => (
              <div key={hostel._id} className="col-md-4 mb-4">
                <div className="image-slider position-relative">
                  <PropertyCard property={hostel} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted">
              <p>No hostels found in {searchedCity}.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

export default function WrappedHostelPage() {
  return (
    <ErrorBoundary>
      <HostelPage />
    </ErrorBoundary>
  );
}
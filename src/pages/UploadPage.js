import React, { useState } from "react";
import axios from "axios";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../pages/UploadPage.css";

const UploadPage = () => {
  const [propertyType, setPropertyType] = useState("home");
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    ownerName: "",
    ownerContact: "",
    facing: "",
    floor: "",
    carpetArea: "",
    parking: { car: false, bike: false },
    sharedBy: "",
    facilities: { food: false, wifi: false, transport: false, laundry: false },
    images: null,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle toggle buttons
  const handleToggleChange = (key, subKey) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [subKey]: !prev[key][subKey],
      },
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to upload a property.");
      setUploading(false);
      navigate("/");
      return;
    }

    const data = new FormData();
    data.append("type", propertyType);

    Object.keys(formData).forEach((key) => {
      if (key === "parking" || key === "facilities") {
        data.append(key, JSON.stringify(formData[key]));
      } else if (key === "images" && formData.images) {
        for (let i = 0; i < formData.images.length; i++) {
          data.append("images", formData.images[i]);
        }
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/properties/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);

      // Reset form after successful upload
      setFormData({
        title: "",
        location: "",
        price: "",
        ownerName: "",
        ownerContact: "",
        facing: "",
        floor: "",
        carpetArea: "",
        parking: { car: false, bike: false },
        sharedBy: "",
        facilities: { food: false, wifi: false, transport: false, laundry: false },
        images: null,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Session expired. Please log in again.");
        navigate("/");
      } else {
        setError("Error uploading property: " + (error.response?.data?.message || "Unknown error"));
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <FaHome className="home-icon" onClick={() => navigate("/mainpage")} style={{ position: "absolute", top: "20px", left: "20px", cursor: "pointer" }} />
      <h2>Upload New Property</h2>
      {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}

      {/* Note Section */}
      <div className="note-section bg-yellow-50 p-4 rounded-lg shadow-md mb-6 border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Guidelines</h3>
        <ul className="list-disc pl-5 text-gray-700">
          <li className="mb-1">
            Do not upload fake data or images. Ensure all information and visuals accurately represent the property.
          </li>
          <li className="mb-1">
            Avoid submitting inappropriate data or images. Content must adhere to community standards and be suitable for all audiences.
          </li>
          <li className="mb-1">
            Violation of these guidelines may lead to serious consequences, including account suspension or legal action.
          </li>
        </ul>
      </div>

      {/* Toggle Switch for Home/Hostel */}
      <div className="toggle-switch">
        <span className={propertyType === "home" ? "active" : ""}>Home</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={propertyType === "hostel"}
            onChange={() => setPropertyType(propertyType === "home" ? "hostel" : "home")}
          />
          <span className="slider round"></span>
        </label>
        <span className={propertyType === "hostel" ? "active" : ""}>Hostel</span>
      </div>

      <form className="upload-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid-3">
          <div>
            <label>Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div>
            <label>Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </div>
          <div>
            <label>Price:</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>
        </div>

        {/* Conditional Home/Hostel Fields */}
        {propertyType === "home" ? (
          <>
            <div className="grid-3">
              <div>
                <label>Facing:</label>
                <input type="text" name="facing" value={formData.facing} onChange={handleChange} required />
              </div>
              <div>
                <label>Floor:</label>
                <input type="text" name="floor" value={formData.floor} onChange={handleChange} required />
              </div>
              <div>
                <label>Carpet Area:</label>
                <input type="text" name="carpetArea" value={formData.carpetArea} onChange={handleChange} required />
              </div>
            </div>

            {/* Parking Toggle Buttons */}
            <label>Parking:</label>
            <div className="grid-2">
              {["car", "bike"].map((type) => (
                <div key={type} className="toggle-group">
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)} Parking</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={formData.parking[type]}
                      onChange={() => handleToggleChange("parking", type)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <label>Shared By:</label>
            <select name="sharedBy" value={formData.sharedBy} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="1">1 Sharing</option>
              <option value="2">2 Sharing</option>
              <option value="3">3 Sharing</option>
              <option value="4+">4+ Sharing</option>
            </select>

            <label>Facilities:</label>
            <div className="grid-2">
              {["food", "wifi", "transport", "laundry"].map((facility) => (
                <div key={facility} className="toggle-group">
                  <span>{facility.charAt(0).toUpperCase() + facility.slice(1)}</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={formData.facilities[facility]}
                      onChange={() => handleToggleChange("facilities", facility)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Owner Details */}
        <div className="grid-2">
          <div>
            <label>Owner Name:</label>
            <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required />
          </div>
          <div>
            <label>Owner Contact:</label>
            <input type="text" name="ownerContact" value={formData.ownerContact} onChange={handleChange} required />
          </div>
        </div>

        {/* Upload Images */}
        <label>Upload Images (Max 5):</label>
        <input type="file" name="images" onChange={handleFileChange} multiple accept="image/*" required />

        {/* Submit Button */}
        <button className="upload-btn" type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
import React, { useEffect, useState } from "react";

const PropertyList = () => {
  const [homes, setHomes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/properties")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ PropertyList API Response:", data);
        const homesArray = data.properties || [];
        setHomes(homesArray.map((home) => ({
          ...home,
          images: home.images || [], // Ensure images is always an array
        })));
      })
      .catch((err) => console.error("❌ Error fetching properties:", err));
  }, []);

  return (
    <div className="space-y-4 w-full px-4">
      {homes.length > 0 ? (
        homes.map((home) => {
          const imageUrl = home.images?.length > 0
            ? `http://localhost:5000/${home.images[0]}`
            : "https://via.placeholder.com/300";

          return (
            <div key={home._id} className="bg-white shadow-md rounded-lg p-4 flex">
              <div className="w-1/3 relative">
                <img
                  src={imageUrl}
                  alt={home.title}
                  className="w-full h-48 object-cover rounded-md"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                />
                <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  Updated today
                </span>
              </div>
              <div className="w-2/3 pl-4">
                <h2 className="text-xl font-bold">{home.title}</h2>
                <p className="text-sm text-gray-600 mb-1">📍 {home.location}</p>
                <div className="flex items-center justify-between mt-1 text-gray-700">
                  <span className="text-lg font-bold text-red-600">₹{home.price}</span>
                  <span className="text-sm">🚗 Parking: {home.parking ? "Yes" : "No"}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">👤 Owner: {home.owner || "N/A"}</p>
                <p className="text-sm text-gray-600 mt-2">📞 Contact: {home.contact || "N/A"}</p>
                <div className="flex space-x-2 mt-4">
                  <button className="bg-red-500 text-white px-4 py-2 rounded">Contact Owner</button>
                  <button className="border border-red-500 text-red-500 px-4 py-2 rounded">Make Offer</button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center">No homes found in this area.</p>
      )}
    </div>
  );
};

export default PropertyList;
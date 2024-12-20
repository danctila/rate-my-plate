import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import RestaurantList from "../../components/Restaurant/RestaurantList";
import RestaurantModal from "../../components/Restaurant/RestaurantModal";
import { getUserLocation } from "../../utils/location";
import { haversineDistance } from "../../utils/distance";
import mockRestaurants from "../../data/mockRestaurants";

function RestaurantPage() {
  const [huskyDollarsSelected, setHuskyDollarsSelected] = useState(false);
  const [studentDiscountSelected, setStudentDiscountSelected] = useState(false);
  const [sortByNearest, setSortByNearest] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [mapCenter, setMapCenter] = useState([42.3382, -71.0877]);

  // Fetch user location
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);
        setMapCenter([location.lat, location.lng]);
        fetchAddress(location.lat, location.lng);
      } catch (error) {
        console.error("Error retrieving user location:", error);
      }
    };

    fetchUserLocation();
  }, []);

  // Convert coordinates to address using Nominatim API
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        // Split the address and join only the first four parts
        const trimmedAddress = data.display_name
          .split(",")
          .slice(0, 4)
          .join(",");
        setAddress(trimmedAddress);
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error retrieving address");
    }
  };

  // Sort and filter restaurants
  useEffect(() => {
    let filtered = [...restaurants];

    if (huskyDollarsSelected) {
      filtered = filtered.filter((r) => r.acceptsHuskyDollars);
    }

    if (studentDiscountSelected) {
      filtered = filtered.filter((r) => r.hasStudentDiscount !== "None");
    }

    if (sortByNearest && userLocation) {
      filtered = filtered
        .map((restaurant) => ({
          ...restaurant,
          distance: haversineDistance(
            userLocation.lat,
            userLocation.lng,
            restaurant.location.lat,
            restaurant.location.lng
          ),
        }))
        .sort((a, b) => a.distance - b.distance);
    }

    setSortedRestaurants(filtered);
  }, [
    huskyDollarsSelected,
    studentDiscountSelected,
    sortByNearest,
    userLocation,
    restaurants,
  ]);

  const toggleHuskyDollars = () => setHuskyDollarsSelected((prev) => !prev);
  const toggleStudentDiscount = () =>
    setStudentDiscountSelected((prev) => !prev);
  const toggleSortByNearest = () => setSortByNearest((prev) => !prev);

  const handleRestaurantClick = (restaurant) =>
    setSelectedRestaurant(restaurant);
  const handleCloseModal = () => setSelectedRestaurant(null);

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 md:px-10 py-6 bg-[#f1efef]">
      <h1 className="text-4xl font-bold mb-6 text-[#00426c]">Restaurants</h1>

      {/* Display User Location */}
      <div className="mb-4 text-[#292423] flex items-center">
        {userLocation ? (
          <>
            <button
              onClick={() => setMapCenter([userLocation.lat, userLocation.lng])}
              className="mr-4 bg-white rounded-full shadow-md hover:bg-gray-200 flex items-center justify-center 
                         transition-all w-10 h-10 aspect-square active:translate-y-0.5 active:shadow-inner"
              title="Center to My Location"
            >
              <FontAwesomeIcon
                icon={faLocationArrow}
                className="text-[#39b2ff] w-6 h-6"
              />
            </button>
            <p>
              Your Location:{" "}
              <span className="font-semibold">
                {/* Display only lat and lng -> Lat: {userLocation.lat.toFixed(2)}, Lng:{" "} {userLocation.lng.toFixed(2)} */}

                {address ||
                  `Lat: ${userLocation.lat.toFixed(
                    2
                  )}, Lng: ${userLocation.lng.toFixed(2)}`}
              </span>
            </p>
          </>
        ) : (
          <p>Fetching your location...</p>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={toggleHuskyDollars}
          className={`px-4 py-2 border rounded transition duration-200 ${
            huskyDollarsSelected
              ? "bg-[#39b2ff] text-white border-[#00426c]"
              : "bg-white text-[#00426c] border-black hover:bg-[#9fdaff] hover:border-[#00426c]"
          }`}
        >
          Dining Dollars
        </button>
        <button
          onClick={toggleStudentDiscount}
          className={`px-4 py-2 border rounded transition duration-200 ${
            studentDiscountSelected
              ? "bg-[#39b2ff] text-white border-[#00426c]"
              : "bg-white text-[#00426c] border-black hover:bg-[#9fdaff] hover:border-[#00426c]"
          }`}
        >
          Student Discount
        </button>
        <button
          onClick={toggleSortByNearest}
          className={`px-4 py-2 border rounded transition duration-200 ${
            sortByNearest
              ? "bg-[#39b2ff] text-white border-[#00426c]"
              : "bg-white text-[#00426c] border-black hover:bg-[#9fdaff] hover:border-[#00426c]"
          }`}
        >
          Sort by Nearest
        </button>
      </div>

      {/* Render RestaurantList */}
      <RestaurantList
        restaurants={sortedRestaurants}
        onRestaurantClick={handleRestaurantClick}
        userLocation={userLocation}
        mapCenter={mapCenter}
        setMapCenter={setMapCenter}
      />

      {/* Restaurant Modal */}
      {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default RestaurantPage;

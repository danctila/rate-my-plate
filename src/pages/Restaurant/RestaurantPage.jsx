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
  const [popupRestaurant, setPopupRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [flyToCoords, setFlyToCoords] = useState({ center: null, zoom: 16 });

  // Fetch user location
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);
        fetchUserAddress(location.lat, location.lng);
      } catch (error) {
        console.error("Error retrieving user location:", error);
      }
    };

    fetchUserLocation();
  }, []);

  // Fetch user address from lat, lng
  const fetchUserAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        const trimmedAddress = data.display_name
          .split(",")
          .slice(0, 4)
          .join(",");
        setUserAddress(trimmedAddress);
      } else {
        setUserAddress("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setUserAddress("Error retrieving address");
    }
  };

  // Fly to restaurant location on map
  const handleFlyToRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setPopupRestaurant(restaurant);

    setFlyToCoords({
      center: [restaurant.location.lat, restaurant.location.lng],
      zoom: 18,
    });

    const mapSection = document.querySelector(".map-container");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    setTimeout(() => {
      setSelectedRestaurant(null);
    }, 0);
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

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 md:px-10 py-6 bg-[#f1efef]">
      <h1 className="text-4xl font-bold mb-6 text-[#00426c]">Restaurants</h1>

      {/* Display User Location */}
      <div className="mb-4 text-[#292423] flex items-center">
        {userLocation ? (
          <>
            <button
              onClick={() =>
                setFlyToCoords({
                  center: [userLocation.lat, userLocation.lng],
                  zoom: 16,
                })
              }
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

                {userAddress ||
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
          onClick={() => setHuskyDollarsSelected((prev) => !prev)}
          className={`px-4 py-2 border rounded transition duration-200 ${
            huskyDollarsSelected
              ? "bg-[#39b2ff] text-white border-[#00426c]"
              : "bg-white text-[#00426c] border-black hover:bg-[#9fdaff] hover:border-[#00426c]"
          }`}
        >
          Dining Dollars
        </button>
        <button
          onClick={() => setStudentDiscountSelected((prev) => !prev)}
          className={`px-4 py-2 border rounded transition duration-200 ${
            studentDiscountSelected
              ? "bg-[#39b2ff] text-white border-[#00426c]"
              : "bg-white text-[#00426c] border-black hover:bg-[#9fdaff] hover:border-[#00426c]"
          }`}
        >
          Student Discount
        </button>
        <button
          onClick={() => setSortByNearest((prev) => !prev)}
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
        onRestaurantClick={(restaurant) => setSelectedRestaurant(restaurant)}
        userLocation={userLocation}
        flyToCoords={flyToCoords}
        selectedPopup={popupRestaurant}
      />

      {/* Restaurant Modal */}
      {selectedRestaurant && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          onSeeOnMap={handleFlyToRestaurant}
        />
      )}
    </div>
  );
}

export default RestaurantPage;

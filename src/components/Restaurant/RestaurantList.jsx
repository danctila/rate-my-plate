import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icon for markers
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FlyTo({ flyToCoords }) {
  const map = useMap();
  useEffect(() => {
    if (flyToCoords?.center) {
      map.flyTo(flyToCoords.center, flyToCoords.zoom, { duration: 1.2 });
    }
  }, [flyToCoords, map]);

  return null;
}

function RestaurantList({
  restaurants,
  onRestaurantClick,
  userLocation,
  flyToCoords,
  selectedPopup,
}) {
  const popupRefs = useRef({});

  useEffect(() => {
    if (selectedPopup && popupRefs.current[selectedPopup.id]) {
      popupRefs.current[selectedPopup.id].openPopup();
    }
  }, [selectedPopup]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Map Section */}
      <div className="w-full h-96 mb-6">
        <MapContainer
          center={flyToCoords?.center || [42.3382, -71.0877]}
          zoom={16}
          className="map-container w-full h-full rounded-lg shadow-lg"
          scrollWheelZoom={true}
        >
          {/* Adjust Center Dynamically */}
          <FlyTo flyToCoords={flyToCoords} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {userLocation && (
            <>
              {/* User Marker */}
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={customIcon}
              >
                <Popup>You are here</Popup>
              </Marker>

              {/* Circle Around User Location */}
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={userLocation.accuracy || 100}
                color="#ff4439"
                fillColor="#ffa49f"
                fillOpacity={0.2}
              />
            </>
          )}

          {/* Restaurant Markers */}
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={[restaurant.location.lat, restaurant.location.lng]}
              icon={customIcon}
              eventHandlers={{
                click: (e) => {
                  const map = e.target._map;
                  const { lat, lng } = restaurant.location;

                  // Center the map on the restaurant
                  map.flyTo([lat, lng], 18, { duration: 1.2 });

                  // Open the popup after the map centers
                  setTimeout(() => {
                    e.target.openPopup();
                  }, 200);
                },
              }}
              ref={(ref) => (popupRefs.current[restaurant.id] = ref)}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold">{restaurant.name}</h3>
                  <p>{restaurant.cuisine}</p>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mt-2 hover:bg-blue-600"
                    onClick={() => onRestaurantClick(restaurant)}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Restaurant Cards Section */}
      <div className="grid gap-6">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="flex flex-col sm:flex-row items-center sm:items-start p-4 border rounded-lg shadow-lg cursor-pointer hover:shadow-xl bg-white"
              style={{ backgroundColor: "#fbfbfb" }}
              onClick={() => onRestaurantClick(restaurant)}
            >
              {/* Restaurant Image */}
              <div className="flex-shrink-0 w-full sm:w-48 h-48 bg-gray-200 rounded-lg mb-4 sm:mb-0 sm:mr-4">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>

              {/* Basic Restaurant Details */}
              <div className="flex flex-col flex-grow text-center sm:text-left">
                <h3 className="text-xl font-bold">{restaurant.name}</h3>
                <p className="text-gray-600">
                  <strong>Cuisine:</strong> {restaurant.cuisine}
                </p>
                <p className="text-gray-600">
                  <strong>Accepts Dining Dollars:</strong>{" "}
                  {restaurant.acceptsHuskyDollars ? (
                    <span className="text-green-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-bold">No</span>
                  )}
                </p>
                <p className="text-gray-600">
                  <strong>Student Discount:</strong>{" "}
                  <span className="text-blue-600">
                    {restaurant.hasStudentDiscount}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No restaurants found matching the selected criteria.</p>
        )}
      </div>
    </div>
  );
}

export default RestaurantList;

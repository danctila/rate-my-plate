import React from "react";

function RestaurantDetails({ restaurant, onSeeOnMap }) {
  return (
    <div className="p-6 rounded-lg bg-white max-w-3xl mx-auto">
      {/* Restaurant Header */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          {restaurant.name}
        </h2>
        <p className="text-lg text-gray-600">{restaurant.cuisine}</p>
      </div>

      {/* Row of Images */}
      <div
        className={`grid mb-6 ${
          restaurant.images?.length === 2
            ? "grid-cols-2 justify-center"
            : "grid-cols-2 sm:grid-cols-3 gap-4"
        }`}
      >
        {restaurant.images?.slice(0, 2).map((image, index) => (
          <div key={index} className="flex justify-center items-center">
            <img
              key={index}
              src={image}
              alt={`${restaurant.name} - ${index + 1}`}
              className="rounded-lg shadow-sm object-cover"
              style={{ height: "150px", width: "200px" }}
            />
          </div>
        ))}
        {/* Third image only on larger screens */}
        {restaurant.images?.[2] && (
          <div className="hidden sm:flex justify-center items-center">
            <img
              src={restaurant.images[2]}
              alt={`${restaurant.name} - 3`}
              className="rounded-lg shadow-sm object-cover hidden sm:block"
              style={{ height: "150px", width: "200px" }}
            />
          </div>
        )}
      </div>

      {/* Restaurant Information */}
      <div className="mb-6">
        <p className="text-gray-700 mb-2">
          <strong>Accepts Dining Dollars:</strong>{" "}
          {restaurant.acceptsHuskyDollars ? (
            <span className="text-green-600 font-bold">Yes</span>
          ) : (
            <span className="text-red-600 font-bold">No</span>
          )}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Student Discount:</strong>{" "}
          <span className="text-blue-600">{restaurant.hasStudentDiscount}</span>
        </p>
        <p className="text-gray-700">
          <strong>Hours:</strong> <span>{restaurant.hours}</span>
        </p>
      </div>

      <hr className="border-gray-300 mb-6" />

      {/* Menu Section */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Popular Items
        </h3>
        <ul className="list-disc pl-5 space-y-3">
          {restaurant.menu.map((menuItem, index) => (
            <li key={index} className="text-gray-800">
              <span className="font-semibold">{menuItem.item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Google Maps and See on Map Buttons */}
      <div className="flex justify-center gap-4">
        <a
          href={restaurant.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-[#39b2ff] text-white font-semibold rounded-lg shadow-md hover:bg-[#00426c] transition"
        >
          View on Google Maps
        </a>
        <button
          onClick={() => onSeeOnMap(restaurant)}
          className="inline-block px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
        >
          See on Map
        </button>
      </div>
    </div>
  );
}

export default RestaurantDetails;

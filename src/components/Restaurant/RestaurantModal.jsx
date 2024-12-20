import { React, useState, useEffect } from "react";
import RestaurantChat from "./RestaurantChat";
import RestaurantDetails from "./RestaurantDetails";

function RestaurantModal({ restaurant, onClose, onSeeOnMap }) {
  const [isVisible, setIsVisible] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      triggerClose();
    }
  };

  // Out animation and close modal
  const triggerClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  // In animation and scroll-locking effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 0);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4"
      onClick={handleOverlayClick}
    >
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[95vh] overflow-y-auto transform transition-all duration-500 ease-in-out mt-8 mb-8 sm:mt-16 sm:mb-16 ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-5 scale-95"
        }`}
        style={{
          clipPath: "inset(0 round 0.5rem)", // Rounded corners w/ scroll bar
        }}
      >
        {/* Close Button */}
        <button
          onClick={triggerClose}
          className="absolute top-2 right-2 text-[#ff4439] hover:text-red-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Restaurant Details */}
        <RestaurantDetails
          restaurant={restaurant}
          onSeeOnMap={() => onSeeOnMap(restaurant)}
        />

        <hr className="border-gray-300 my-6" />

        {/* Chat Room */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Student Thoughts
          </h3>
          <RestaurantChat restaurantId={String(restaurant.id)} />
        </div>
      </div>
    </div>
  );
}

export default RestaurantModal;

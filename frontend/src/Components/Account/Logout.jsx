// src/Components/Account/Logout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Success icon
import { ImSpinner2 } from "react-icons/im"; // Spinner

const Logout = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1️⃣ Clear all auth-related data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");

    // 2️⃣ Dispatch a global logout event
    const logoutEvent = new CustomEvent("userLoggedOut");
    window.dispatchEvent(logoutEvent);

    // 3️⃣ Simulate a "logging out" progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/"), 500); // ✅ Redirect to homepage
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center border border-gray-200">
        {progress < 100 ? (
          <>
            <ImSpinner2 className="animate-spin text-blue-500 mx-auto mb-4 text-4xl" />
            <h1 className="text-xl font-semibold mb-2">Logging you out...</h1>
            <p className="text-gray-600 mb-4">
              Protecting your account and clearing session data.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-500">{progress}% completed</p>
          </>
        ) : (
          <>
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Successfully Logged Out!</h1>
            
          </>
        )}
      </div>
    </div>
  );
};

export default Logout;

// src/Components/Home/HomePage.jsx
import React, { useEffect, useState } from "react";
import LoggedInHome from "./LoggedInHome";
import LoggedOutHome from "./LoggedOutHome";

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // Listen to changes in localStorage (cross-tab or manual updates)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return isLoggedIn ? <LoggedInHome /> : <LoggedOutHome />;
}

export default HomePage;

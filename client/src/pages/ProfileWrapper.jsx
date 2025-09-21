// src/pages/ProfileWrapper.jsx
import React, { useState, useEffect } from "react";
import UserProfile from "./job-seeker-profile/UserProfile";
import CompanyProfile from "./job-seeker-profile/CompanyProfile";

const ProfileWrapper = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const parsedUser = JSON.parse(userString);
      console.log("User loaded from localStorage:", parsedUser); // ✅ Debug
      setUser(parsedUser);
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return user.role === "company" ? <CompanyProfile /> : <UserProfile />;
};

export default ProfileWrapper;

import React, { useEffect, useState } from "react";
import axios from "axios";
import FollowButton from "../../components/FollowButton"; // NEW: Import FollowButton

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followCounts, setFollowCounts] = useState({ followersCount: 0, followingCount: 0 }); // NEW: Follow counts

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const storedUserString = localStorage.getItem("user");
      const storedUser = storedUserString ? JSON.parse(storedUserString) : null;

      if (!token || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        const [profileRes, countsRes] = await Promise.all([
          // Fetch user profile
          axios.get("http://localhost:5000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // NEW: Fetch follow counts
          axios.get(`http://localhost:5000/api/follow/follow-counts/${storedUser._id}`)
        ]);

        const profile = profileRes.data;

        setUser({
          _id: profile._id, // NEW: Include user ID
          fullName: profile.fullName,
          email: profile.email,
          professionalTitle: profile.professionalTitle,
          profileImage: profile.profilePicture || "https://randomuser.me/api/portraits/men/32.jpg",
          skills: profile.skills || [], // NEW: Include skills
          role: profile.role // NEW: Include role
        });

        // NEW: Set follow counts
        setFollowCounts(countsRes.data);

      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading profile...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500">
        No user found. Please log in again.
      </p>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto flex gap-6 p-6">
        {/* Sidebar */}
        <aside className="w-1/4 hidden md:block">
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-700">
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h2 className="mt-3 text-lg font-bold text-gray-800">
                {user.fullName}
              </h2>
              <p className="text-sm text-gray-500">{user.professionalTitle}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              
              {/* NEW: Follow counts */}
              <div className="mt-4 flex justify-around w-full">
                <div className="text-center">
                  <div className="font-semibold">{followCounts.followersCount}</div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{followCounts.followingCount}</div>
                  <div className="text-xs text-gray-500">Following</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-md font-semibold text-gray-800 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-purple-600">
              <li><a href="#">Connections</a></li>
              <li><a href="#">Groups</a></li>
              <li><a href="#">Saved Jobs</a></li>
              <li><a href="#">Portfolio</a></li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
              <img 
                src={user.profileImage}
                alt={user.fullName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{user.fullName}</h1>
              <p className="text-gray-600">{user.professionalTitle}</p>
              <p className="text-gray-500">Rawalpindi, Punjab, Pakistan</p>
              
              {/* NEW: Follow counts for mobile */}
              <div className="flex gap-4 mt-2 md:hidden">
                <div>
                  <span className="font-semibold">{followCounts.followersCount}</span>
                  <span className="text-gray-500 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-semibold">{followCounts.followingCount}</span>
                  <span className="text-gray-500 ml-1">Following</span>
                </div>
              </div>
              
              <div className="flex gap-3 mt-3">
                {/* NEW: Follow button for other users */}
                {user._id !== JSON.parse(localStorage.getItem("user"))._id && (
                  <FollowButton targetId={user._id} targetType={user.role} />
                )}
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-gray-600">
              I am a passionate Computer Engineering student at International Islamic University, 
              Islamabad with interests in web development, AI, and software engineering. 
              Always eager to learn and collaborate on impactful projects.
            </p>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Activity</h2>
            <p className="text-gray-600">{followCounts.followersCount} followers</p>
            <p className="text-gray-500 mt-2">
              {followCounts.followersCount === 0 
                ? "No followers yet. Your followers will appear here." 
                : "Recent posts will appear here."}
            </p>
          </div>

          {/* NEW: Skills section */}
          {user.skills && user.skills.length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Education</h2>
            <div>
              <p className="font-medium text-gray-700">
                International Islamic University, Islamabad
              </p>
              <p className="text-gray-500">BS Computer Engineering (2025 - 2029)</p>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Licenses & Certifications
            </h2>
            <ul className="space-y-4">
              <li>
                <p className="font-medium text-gray-700">
                  Foundations of Coding Full-Stack
                </p>
                <p className="text-gray-500">Microsoft • Issued Sep 2025</p>
                <p className="text-sm text-gray-400">Credential ID: PY8U9JO9FZK9</p>
              </li>
              <li>
                <p className="font-medium text-gray-700">Introduction to DevOps</p>
                <p className="text-gray-500">IBM • Issued Sep 2025</p>
                <p className="text-sm text-gray-400">Credential ID: 8JT358XIU80W</p>
              </li>
            </ul>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Interests</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Amazon – 35,225,050 followers</li>
              <li>
                International Islamic University, Islamabad – 66,778 followers
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserProfile;
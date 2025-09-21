import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "components/AppIcon";
import EditProfile from "pages/job-seeker-profile/EditProfile";
import Breadcrumb from "components/ui/Breadcrumb";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardMetrics from "./components/DashboardMetrics";
import RecentActivity from "./components/RecentActivity";
import SavedJobs from "./components/SavedJobs";
import ApplicationTracker from "./components/ApplicationTracker";
import JobAlerts from "./components/JobAlerts";
import ProfileCompletion from "./components/ProfileCompletion";
import MobileNavigation from "./components/MobileNavigation";
import axios from "axios";

const JobSeekerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);

  const userProfile = async (userId, token) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      console.error(
        "Error fetching profile:",
        err.response?.data || err.message
      );
      return null;
    }
  };

  useEffect(() => {
  const fetchProfile = async () => {
    const storedUserString = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    const storedUser = storedUserString ? JSON.parse(storedUserString) : null;

    if (!storedUser || !storedToken) return;

    const profile = await userProfile(storedUser._id, storedToken);

    if (profile) {
      setUserData({
        name: profile.fullName,
        email: profile.email,
        profileImage:
          profile.profilePicture ||
          "https://randomuser.me/api/portraits/men/32.jpg",
        profileCompletion: profile.profileCompletion || 65,
        metrics: profile.metrics || {
          applicationsSubmitted: 12,
          interviewsScheduled: 3,
          savedJobs: 8,
          newMatches: 5,
        },
      });
    }
  };

  fetchProfile();
}, []);


  const renderTabContent = () => {
    if (!userData) return <p>Loading...</p>;

    switch (activeTab) {
      case "overview":
        return (
          <>
            <DashboardMetrics metrics={userData?.metrics || {}} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <RecentActivity />
              </div>
              <div className="lg:col-span-1">
                <ProfileCompletion
                  completion={userData?.profileCompletion || 0}
                />
              </div>
            </div>
            <div className="mt-6">
              <SavedJobs limit={4} showViewAll={true} />
            </div>
          </>
        );
      case "applications":
        return <ApplicationTracker />;
      case "saved":
        return <SavedJobs />;
      case "alerts":
        return <JobAlerts />;
      case "editProfile":
        return <EditProfile />;
      default:
        return <div>Content not available</div>;
    }
  };

  return (
    <div className="bg-surface min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            {userData ? (
              <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userData={userData}
              />
            ) : (
              <div className="p-4 text-text-secondary">Loading profile...</div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-background rounded-lg shadow-sm border border-border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">
                    {activeTab === "overview"
                      ? "Dashboard"
                      : activeTab === "applications"
                      ? "Applications"
                      : activeTab === "saved"
                      ? "Saved Jobs"
                      : activeTab === "alerts"
                      ? "Job Alerts"
                      : "Dashboard"}
                  </h1>
                  <p className="text-text-secondary mt-1">
                    {activeTab === "overview"
                      ? `Welcome back, ${userData?.name || "User"}`
                      : activeTab === "applications"
                      ? "Track your job applications"
                      : activeTab === "saved"
                      ? "Jobs you've saved for later"
                      : activeTab === "alerts"
                      ? "Manage your job alert preferences"
                      : ""}
                  </p>
                </div>

                <div className="flex space-x-3">
                
                  <Link
                    to="/job-search-browse"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Icon name="Search" size={16} />
                    <span className="hidden sm:inline">Find Jobs</span>
                  </Link>
                </div>
              </div>

              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-10">
        <MobileNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
};

export default JobSeekerDashboard;

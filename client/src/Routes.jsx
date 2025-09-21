// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";

import JobSeekerRegistrationLogin from "pages/job-seeker-registration-login";
import JobDetailApplication from "pages/job-detail-application";
import JobSearchBrowse from "pages/job-search-browse";
import JobSeekerDashboard from "pages/job-seeker-dashboard";
import RecruiterDashboardAnalytics from "pages/recruiter-dashboard-analytics";
import CompanyRegistrationProfileSetup from "pages/company-registration-profile-setup";
import JobPostingCreationManagement from "pages/job-posting-creation-management";
import AdminModerationManagement from "pages/admin-moderation-management";
import NotFound from "pages/NotFound";
import PublicProfile from "pages/PublicProfile";
import UserProfile from "pages/job-seeker-profile/UserProfile";
import Settings from "pages/job-seeker-profile/Settings";
import SavedJobs from "pages/job-seeker-profile/SavedJobs";
import ApplicationHistory from "pages/job-seeker-profile/ApplicationHistory";
import ProfileWrapper from "pages/ProfileWrapper";
import CompanyDashboard from "./pages/company-dashboard/CompanyDashboard";
import PrivateRoute from "./components/PrivateRoute";
import CompanyProfile from "pages/job-seeker-profile/CompanyProfile";
import SearchPage from "components/SearchPage";
import Conversations from "pages/Conversations";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Header />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/" element={<JobSearchBrowse />} />
          <Route path="/login" element={<JobSeekerRegistrationLogin />} />
          <Route path="/job-search-browse" element={<JobSearchBrowse />} />
          <Route path="/job-detail-application" element={<JobDetailApplication />} />

          {/* Protected Routes */}
          <Route
            path="/job-seeker-dashboard"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <JobSeekerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/job-posting-creation-management"
            element={
              <PrivateRoute allowedRoles={["company"]}>
                <JobPostingCreationManagement />
              </PrivateRoute>
            }
          />
          <Route
  path="/user-profile"
  element={
    <PrivateRoute allowedRoles={["user"]}>
      <UserProfile />
    </PrivateRoute>
  }
/>

<Route
  path="/company-profile"
  element={
    <PrivateRoute allowedRoles={["company"]}>
      <CompanyProfile />
    </PrivateRoute>
  }
/>
          <Route path="/user-setting" element={<Settings />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/history" element={<ApplicationHistory />} />
          <Route path="/recruiter-dashboard-analytics" element={<RecruiterDashboardAnalytics />} />
          <Route path="/company-registration-profile-setup" element={<CompanyRegistrationProfileSetup />} />
          <Route path="/admin-moderation-management" element={<AdminModerationManagement />} />
          <Route path="/profile/:id" element={<PublicProfile />} />

          <Route
  path="/messages"
  element={
    <PrivateRoute allowedRoles={["user", "company"]}>
      <Conversations />
    </PrivateRoute>
  }
/>
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;

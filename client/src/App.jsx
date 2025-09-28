import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.js'
import LoadingSpinner from './components/common/LoadingSpinner.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import Navbar from './components/Layout/Navbar.jsx'
import Footer from './components/Layout/Footer.jsx'
import ChatWidget from './components/common/ChatWidget.jsx'
import Companies from './pages/Companies.jsx'
import NewJob from './pages/company/NewJob.jsx'
import Messages from './pages/Messages.jsx'
// Auth Pages
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'

// Main Pages
import Home from './pages/Home.jsx'

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard.jsx'
import CandidateProfile from './pages/candidate/Profile.jsx'
import CandidateJobs from './pages/candidate/Jobs.jsx'
import CandidateApplications from './pages/candidate/Applications.jsx'
import CandidateConnections from './pages/candidate/Connections.jsx'
import CandidateFeed from './pages/candidate/Feed.jsx'

// Company Pages
import CompanyDashboard from './pages/company/Dashboard.jsx'
import CompanyProfile from './pages/company/Profile.jsx'
import CompanyJobPostings from './pages/company/JobPostings.jsx'
import CompanyApplications from './pages/company/Applications.jsx'
import CompanyAnalytics from './pages/company/Analytics.jsx'
import CompanyFeed from './pages/company/Feed.jsx'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminUsers from './pages/admin/Users.jsx'
import AdminCompanies from './pages/admin/Companies.jsx'
import AdminJobs from './pages/admin/Jobs.jsx'

function App() {
  const { loading, isAuthenticated, user } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading ProConnect..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to={getDefaultRoute(user)} />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register /> : <Navigate to={getDefaultRoute(user)} />} 
          />

          {/* Candidate Routes */}
          <Route 
            path="/candidate/dashboard" 
            element={<ProtectedRoute roles={['candidate']}><CandidateDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/candidate/profile" 
            element={<ProtectedRoute roles={['candidate']}><CandidateProfile /></ProtectedRoute>} 
          />
          <Route 
            path="/candidate/jobs" 
            element={<ProtectedRoute roles={['candidate']}><CandidateJobs /></ProtectedRoute>} 
          />
          <Route 
            path="/candidate/applications" 
            element={<ProtectedRoute roles={['candidate']}><CandidateApplications /></ProtectedRoute>} 
          />
          <Route 
            path="/candidate/connections" 
            element={<ProtectedRoute roles={['candidate']}><CandidateConnections /></ProtectedRoute>} 
          />
          <Route 
            path="/candidate/feed" 
            element={<ProtectedRoute roles={['candidate']}><CandidateFeed /></ProtectedRoute>} 
          />

          {/* Company Routes - ORDER MATTERS */}
          <Route 
            path="/company/jobs/new" 
            element={<ProtectedRoute roles={['company']}><NewJob /></ProtectedRoute>} 
          />
          <Route 
            path="/company/jobs/:id" 
            element={
              <ProtectedRoute roles={['company']}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">Job Details</h1>
                  <p className="text-gray-600">Job details page for companies coming soon...</p>
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/jobs" 
            element={<ProtectedRoute roles={['company']}><CompanyJobPostings /></ProtectedRoute>} 
          />
          <Route 
            path="/company/dashboard" 
            element={<ProtectedRoute roles={['company']}><CompanyDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/company/profile" 
            element={<ProtectedRoute roles={['company']}><CompanyProfile /></ProtectedRoute>} 
          />
          <Route 
            path="/company/applications" 
            element={<ProtectedRoute roles={['company']}><CompanyApplications /></ProtectedRoute>} 
          />
          <Route 
            path="/company/analytics" 
            element={<ProtectedRoute roles={['company']}><CompanyAnalytics /></ProtectedRoute>} 
          />
          <Route 
            path="/company/feed" 
            element={<ProtectedRoute roles={['company']}><CompanyFeed /></ProtectedRoute>} 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/users" 
            element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/companies" 
            element={<ProtectedRoute roles={['admin']}><AdminCompanies /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/jobs" 
            element={<ProtectedRoute roles={['admin']}><AdminJobs /></ProtectedRoute>} 
          />

          {/* Shared Routes */}
          <Route path="/jobs" element={<CandidateJobs />} />
          <Route path="/jobs/:id" element={
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Job Details</h1>
              <p className="text-gray-600">Job details page coming soon...</p>
            </div>
          } />
          <Route path="/people" element={<CandidateConnections />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/search" element={<Home />} />
 <Route path="/messages" element={<ProtectedRoute roles={['candidate','company']}><Messages /></ProtectedRoute>} />
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
      
      {/* Chat Widget */}
      {isAuthenticated && <ChatWidget />}
    </div>
  )
}

// Helper function to determine default route based on user role
function getDefaultRoute(user) {
  if (!user) return '/'
  
  switch (user.role) {
    case 'candidate':
      return '/candidate/dashboard'
    case 'company':
      return '/company/dashboard'
    case 'admin':
      return '/admin/dashboard'
    default:
      return '/'
  }
}

export default App

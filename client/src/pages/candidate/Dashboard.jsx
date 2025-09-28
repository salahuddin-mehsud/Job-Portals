import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Users, FileText, Bell, TrendingUp, Calendar } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { jobService } from '../../services/jobService.js'
import { applicationService } from '../../services/applicationService.js'
import JobCard from '../../components/common/JobCard.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

const CandidateDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    profileStrength: 65
  })
  const [recommendedJobs, setRecommendedJobs] = useState([])
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        jobService.getJobs({ limit: 4 }),
        applicationService.getApplications()
      ])

      if (jobsResponse.success) {
        setRecommendedJobs(jobsResponse.data.jobs)
      }

      if (applicationsResponse.success) {
        const applications = applicationsResponse.data.applications
        setRecentApplications(applications.slice(0, 5))
        
        const interviewCount = applications.filter(app => 
          app.status === 'interview'
        ).length

        setStats({
          applications: applications.length,
          interviews: interviewCount,
          profileStrength: calculateProfileStrength()
        })
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateProfileStrength = () => {
    let strength = 0
    if (user?.skills?.length > 0) strength += 25
    if (user?.education?.length > 0) strength += 25
    if (user?.experience?.length > 0) strength += 25
    if (user?.bio) strength += 15
    if (user?.resume) strength += 10
    return Math.min(strength, 100)
  }

  const statCards = [
    {
      icon: FileText,
      label: 'Total Applications',
      value: stats.applications,
      color: 'blue'
    },
    {
      icon: Calendar,
      label: 'Interviews',
      value: stats.interviews,
      color: 'green'
    },
    {
      icon: TrendingUp,
      label: 'Profile Strength',
      value: `${stats.profileStrength}%`,
      color: 'purple'
    },
    {
      icon: Users,
      label: 'Connections',
      value: user?.connections?.length || 0,
      color: 'orange'
    }
  ]

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your job search today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const colorClasses = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            orange: 'bg-orange-500'
          }

          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${colorClasses[stat.color]} bg-opacity-10`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recommended Jobs</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {recommendedJobs.map(job => (
              <JobCard key={job._id} job={job} showActions={true} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          {/* Profile Strength */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Strength</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.profileStrength}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Complete your profile to increase your chances of getting hired
            </p>
            <Link
              to="/candidate/profile"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Complete Profile <Briefcase size={16} className="ml-1" />
            </Link>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
            <div className="space-y-3">
              {recentApplications.length === 0 ? (
                <p className="text-gray-500 text-sm">No applications yet</p>
              ) : (
                recentApplications.map(application => (
                  <div key={application._id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-sm">{application.job?.title}</p>
                      <p className="text-xs text-gray-500">{application.job?.company?.name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'hired' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            <Link
              to="/candidate/applications"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-4"
            >
              View all applications
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/jobs"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Briefcase size={18} className="mr-3" />
                Search Jobs
              </Link>
              <Link
                to="/candidate/profile"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FileText size={18} className="mr-3" />
                Update Resume
              </Link>
              <Link
                to="/people"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Users size={18} className="mr-3" />
                Network with People
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateDashboard
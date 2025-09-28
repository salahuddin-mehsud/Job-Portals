import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Users, TrendingUp, FileText, Plus, Eye } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { jobService } from '../../services/jobService.js'
import { applicationService } from '../../services/applicationService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

const CompanyDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        jobService.getCompanyJobs(),
        applicationService.getApplications()
      ])

      if (jobsResponse.success) {
        const jobs = jobsResponse.data.jobs
        setRecentJobs(jobs.slice(0, 5))
        
        const activeJobs = jobs.filter(job => job.status === 'active').length
        setStats(prev => ({
          ...prev,
          totalJobs: jobs.length,
          activeJobs
        }))
      }

      if (applicationsResponse.success) {
        const applications = applicationsResponse.data.applications
        setRecentApplications(applications.slice(0, 5))
        
        const newApplications = applications.filter(app => 
          app.status === 'pending'
        ).length

        setStats(prev => ({
          ...prev,
          totalApplications: applications.length,
          newApplications
        }))
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      icon: Briefcase,
      label: 'Total Jobs',
      value: stats.totalJobs,
      color: 'blue',
      link: '/company/jobs'
    },
    {
      icon: Eye,
      label: 'Active Jobs',
      value: stats.activeJobs,
      color: 'green',
      link: '/company/jobs?status=active'
    },
    {
      icon: FileText,
      label: 'Total Applications',
      value: stats.totalApplications,
      color: 'purple',
      link: '/company/applications'
    },
    {
      icon: Users,
      label: 'New Applications',
      value: stats.newApplications,
      color: 'orange',
      link: '/company/applications?status=pending'
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
          Here's your recruiting dashboard overview.
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
            <Link key={index} to={stat.link} className="block">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
            </Link>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Jobs */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Job Postings</h2>
            <div className="flex space-x-3">
              <Link 
                to="/company/jobs"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View all
              </Link>
              <Link 
                to="/company/jobs/new"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} className="mr-1" />
                Post Job
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {recentJobs.length === 0 ? (
              <div className="p-8 text-center">
                <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                <p className="text-gray-500 mb-4">Start by posting your first job opening</p>
                <Link
                  to="/company/jobs/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus size={16} className="mr-1" />
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentJobs.map(job => (
                  <div key={job._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {job.applications?.length || 0} applications • 
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' :
                        job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.employmentType}</span>
                        <span>•</span>
                        <span>${job.salaryRange?.min?.toLocaleString()} - ${job.salaryRange?.max?.toLocaleString()}</span>
                      </div>
                      <Link
                        to={`/company/jobs/${job._id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
              <Link to="/company/applications" className="text-blue-600 hover:text-blue-700 text-sm">
                View all
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentApplications.length === 0 ? (
                <p className="text-gray-500 text-sm">No applications yet</p>
              ) : (
                recentApplications.map(application => (
                  <div key={application._id} className="flex items-center justify-between py-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{application.candidate?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{application.job?.title}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/company/jobs/new"
                className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <Plus size={18} className="mr-3" />
                  Post New Job
                </span>
                <Briefcase size={16} className="text-gray-400" />
              </Link>
              <Link
                to="/company/profile"
                className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <Users size={18} className="mr-3" />
                  Edit Company Profile
                </span>
                <TrendingUp size={16} className="text-gray-400" />
              </Link>
              <Link
                to="/search?type=candidates"
                className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="flex items-center">
                  <Users size={18} className="mr-3" />
                  Search Candidates
                </span>
                <Eye size={16} className="text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Analytics Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Job Views</span>
                <span className="font-semibold">5,678</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Application Rate</span>
                <span className="font-semibold">12.5%</span>
              </div>
            </div>
            <Link
              to="/company/analytics"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-4"
            >
              View Detailed Analytics <TrendingUp size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDashboard
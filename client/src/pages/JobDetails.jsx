// pages/JobDetails.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Briefcase, Clock, DollarSign, Building, Users, Calendar, ArrowLeft, Share, Bookmark, CheckCircle } from 'lucide-react'
import { jobService } from '../services/jobService.js'
import { useAuth } from '../hooks/useAuth.js'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import ApplicationForm from '../components/common/ApplicationForm.jsx'
import Avatar from '../components/common/Avatar.jsx'
import toast from 'react-hot-toast'

const JobDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    loadJobDetails()
  }, [id])

  const loadJobDetails = async () => {
    try {
      const response = await jobService.getJob(id)
      if (response.success) {
        setJob(response.data)
        // Check if user has already applied
        if (user && response.data.applications) {
          const userApplication = response.data.applications.find(
            app => app.candidate?._id === user._id
          )
          setHasApplied(!!userApplication)
        }
      }
    } catch (error) {
      console.error('Failed to load job details:', error)
      toast.error('Failed to load job details')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to apply for this job')
      navigate('/login')
      return
    }

    if (user?.role !== 'candidate') {
      toast.error('Only candidates can apply for jobs')
      return
    }

    setShowApplicationForm(true)
  }

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false)
    setHasApplied(true)
    toast.success('Application submitted successfully!')
  }

  const handleApplicationCancel = () => {
    setShowApplicationForm(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isJobExpired = job && new Date(job.expiresAt) < new Date()

  if (loading) {
    return <LoadingSpinner text="Loading job details..." />
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Browse All Jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Jobs
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">
                Posted {formatDate(job.createdAt)}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <Bookmark size={20} className="mr-2" />
                Save
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <Share size={20} className="mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar
                    src={job.company?.logo || job.company?.avatar}
                    name={job.company?.name}
                    size="lg"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center">
                        <Building size={18} className="mr-2" />
                        {job.company?.name}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={18} className="mr-2" />
                        {job.location}
                      </div>
                    </div>
                  </div>
                </div>
                {isJobExpired && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    Expired
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-200">
                <div className="flex items-center text-gray-700">
                  <Briefcase size={18} className="mr-2 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Type</div>
                    <div className="capitalize">{job.employmentType?.replace('-', ' ')}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <DollarSign size={18} className="mr-2 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Salary</div>
                    <div>${job.salaryRange?.min?.toLocaleString()} - ${job.salaryRange?.max?.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users size={18} className="mr-2 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Applications</div>
                    <div>{job.applications?.length || 0}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar size={18} className="mr-2 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Expires</div>
                    <div>{formatDate(job.expiresAt)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={18} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={18} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Application Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                {hasApplied ? (
                  <div className="text-center">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Submitted</h3>
                    <p className="text-gray-600 mb-4">You have already applied for this position.</p>
                    <Link
                      to="/candidate/applications"
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      View Applications
                    </Link>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Apply?</h3>
                    <button
                      onClick={handleApplyClick}
                      disabled={isJobExpired || user?.role !== 'candidate'}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold mb-4"
                    >
                      {isJobExpired ? 'Job Expired' : 'Apply Now'}
                    </button>
                    <p className="text-sm text-gray-600 text-center">
                      {job.applications?.length || 0} people have applied
                    </p>
                  </>
                )}
              </div>

              {/* Company Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Company</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar
                    src={job.company?.logo || job.company?.avatar}
                    name={job.company?.name}
                    size="md"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{job.company?.name}</h4>
                    <p className="text-sm text-gray-600">{job.company?.industry}</p>
                  </div>
                </div>
                {job.company?.bio && (
                  <p className="text-gray-700 text-sm mb-4">{job.company.bio}</p>
                )}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {job.company?.location}
                  </div>
                  {job.company?.website && (
                    <div className="flex items-center">
                      <Building size={16} className="mr-2" />
                      <a 
                        href={job.company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <ApplicationForm
          job={job}
          onSuccess={handleApplicationSuccess}
          onCancel={handleApplicationCancel}
        />
      )}
    </div>
  )
}

export default JobDetails
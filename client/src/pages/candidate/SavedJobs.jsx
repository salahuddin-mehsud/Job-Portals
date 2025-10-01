// pages/candidate/SavedJobs.jsx
import React, { useState, useEffect } from 'react'
import { Bookmark, Briefcase, MapPin, DollarSign, Clock, Trash2 } from 'lucide-react'
import { jobService } from '../../services/jobService.js'
import { useAuth } from '../../hooks/useAuth.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadSavedJobs()
  }, [])

  const loadSavedJobs = async () => {
    try {
      const response = await jobService.getSavedJobs()
      if (response.success) {
        setSavedJobs(response.data)
      }
    } catch (error) {
      console.error('Failed to load saved jobs:', error)
      toast.error('Failed to load saved jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsaveJob = async (jobId) => {
    try {
      await jobService.unsaveJob(jobId)
      setSavedJobs(prev => prev.filter(job => job._id !== jobId))
      toast.success('Job removed from saved jobs')
    } catch (error) {
      console.error('Failed to unsave job:', error)
      toast.error('Failed to remove job from saved jobs')
    }
  }

  const handleApply = async (jobId) => {
    // Job application logic here
    console.log('Applied to job:', jobId)
  }

  if (loading) {
    return <LoadingSpinner text="Loading saved jobs..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-2">
            Your collection of interesting job opportunities
          </p>
        </div>
        <div className="flex items-center space-x-2 text-blue-600">
          <Bookmark size={24} />
          <span className="text-lg font-semibold">{savedJobs.length} jobs saved</span>
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs yet</h3>
          <p className="text-gray-500 mb-6">
            Start saving jobs that interest you by clicking the bookmark icon
          </p>
          <Link
            to="/candidate/jobs"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {savedJobs.map(job => (
            <div key={job._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <img
                    src={job.company?.avatar || '/default-company.png'}
                    alt={job.company?.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/jobs/${job._id}`}>
                          <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 cursor-pointer">
                            {job.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600">{job.company?.name}</p>
                      </div>
                      <button
                        onClick={() => handleUnsaveJob(job._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove from saved jobs"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <p className="text-gray-700 mt-2 line-clamp-2">{job.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase size={16} className="mr-2" />
                        {job.employmentType}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign size={16} className="mr-2" />
                        ${job.salaryRange?.min?.toLocaleString()} - ${job.salaryRange?.max?.toLocaleString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-2" />
                        {formatDistanceToNow(new Date(job.createdAt))} ago
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.requirements?.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requirements?.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{job.requirements.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <Link
                  to={`/jobs/${job._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
               
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedJobs
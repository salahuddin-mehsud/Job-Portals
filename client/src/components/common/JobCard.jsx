// components/common/JobCard.jsx
import React, { useState, useEffect } from 'react'
import { MapPin, Briefcase, Clock, DollarSign, Bookmark, BookmarkCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../../hooks/useAuth.js'
import { jobService } from '../../services/jobService.js'
import toast from 'react-hot-toast'
import Avatar from './Avatar.jsx'
import { Link } from 'react-router-dom'

const JobCard = ({ job, onApply, showActions = true }) => {
  const { user, isAuthenticated } = useAuth()
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Check if job is saved when component mounts
    if (user?.savedJobs?.includes(job._id)) {
      setIsSaved(true)
    }
  }, [user, job._id])

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for jobs')
      return
    }

    if (user?.role !== 'candidate') {
      toast.error('Only candidates can apply for jobs')
      return
    }

    try {
      const response = await jobService.applyForJob(job._id, {
        coverLetter: `I'm interested in this position and believe my skills are a great match.`
      })

      if (response.success) {
        toast.success('Application submitted successfully!')
        onApply?.(job._id)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply for job')
    }
  }

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs')
      return
    }

    if (user?.role !== 'candidate') {
      toast.error('Only candidates can save jobs')
      return
    }

    setSaving(true)
    try {
      if (isSaved) {
        await jobService.unsaveJob(job._id)
        setIsSaved(false)
        toast.success('Job removed from saved jobs')
      } else {
        await jobService.saveJob(job._id)
        setIsSaved(true)
        toast.success('Job saved successfully')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job')
    } finally {
      setSaving(false)
    }
  }

  const isExpired = new Date(job.expiresAt) < new Date()

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <Avatar
              src={job.company?.logo || job.company?.avatar}
              name={job.company?.name}
              size="md"
            />
            <div>
              <Link to={`/jobs/${job._id}`}>
                <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 cursor-pointer">
                  {job.title}
                </h3>
              </Link>
              <p className="text-gray-600">{job.company?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isExpired && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Expired
              </span>
            )}
            {showActions && (
              <button
                onClick={handleSaveJob}
                disabled={saving}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                title={isSaved ? 'Remove from saved jobs' : 'Save job'}
              >
                {isSaved ? (
                  <BookmarkCheck size={20} className="text-blue-500 fill-blue-500" />
                ) : (
                  <Bookmark size={20} />
                )}
              </button>
            )}
          </div>
        </div>

        <p className="text-gray-700 line-clamp-2 mb-4">{job.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-1" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase size={16} className="mr-1" />
            {job.employmentType}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign size={16} className="mr-1" />
            ${job.salaryRange?.min?.toLocaleString()} - ${job.salaryRange?.max?.toLocaleString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-1" />
            {formatDistanceToNow(new Date(job.createdAt))} ago
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
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

        {showActions && (
          <div className="flex justify-between items-center">
            <Link
              to={`/jobs/${job._id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>
           
          </div>
        )}
      </div>
    </div>
  )
}

export default JobCard
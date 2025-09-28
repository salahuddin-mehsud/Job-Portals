import React from 'react'
import { MapPin, Briefcase, Clock, DollarSign, Building } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../../hooks/useAuth.js'
import { jobService } from '../../services/jobService.js'
import toast from 'react-hot-toast'

const JobCard = ({ job, onApply, showActions = true }) => {
  const { user, isAuthenticated } = useAuth()

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

  const isExpired = new Date(job.expiresAt) < new Date()

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 cursor-pointer">
                {job.title}
              </h3>
              <p className="text-gray-600">{job.company?.name}</p>
            </div>
          </div>
          {isExpired && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Expired
            </span>
          )}
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
            <button
              onClick={handleApply}
              disabled={isExpired || user?.role !== 'candidate'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isExpired ? 'Expired' : 'Apply Now'}
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobCard
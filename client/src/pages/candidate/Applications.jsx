import React, { useState, useEffect } from 'react'
import { Search, Filter, Calendar, MapPin, Building, Clock, FileText } from 'lucide-react'
import { applicationService } from '../../services/applicationService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from '../../utils/constants.js'

const CandidateApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  })

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const response = await applicationService.getApplications()
      if (response.success) {
        setApplications(response.data.applications)
      }
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = applications.filter(application => {
    const matchesStatus = !filters.status || application.status === filters.status
    const matchesSearch = !filters.search || 
      application.job?.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      application.job?.company?.name.toLowerCase().includes(filters.search.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-600" size={16} />
      case 'viewed': return <FileText className="text-blue-600" size={16} />
      case 'interview': return <Calendar className="text-purple-600" size={16} />
      case 'hired': return <Building className="text-green-600" size={16} />
      default: return <FileText className="text-gray-600" size={16} />
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading your applications..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track your job applications and their status</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="viewed">Viewed</option>
            <option value="interview">Interview</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <div key={application._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{application.job?.title}</h3>
                  <p className="text-gray-600">{application.job?.company?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(application.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${APPLICATION_STATUS_COLORS[application.status]}`}>
                  {APPLICATION_STATUS_LABELS[application.status]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2" />
                {application.job?.location}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                Applied {new Date(application.appliedAt).toLocaleDateString()}
              </div>
              {application.matchScore && (
                <div className="flex items-center">
                  <FileText size={16} className="mr-2" />
                  Match Score: {application.matchScore}%
                </div>
              )}
            </div>

            {application.coverLetter && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Cover Letter:</p>
                <p className="text-sm text-gray-700 line-clamp-2">{application.coverLetter}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {application.viewedAt && `Viewed on ${new Date(application.viewedAt).toLocaleDateString()}`}
                {application.interviewAt && ` • Interview scheduled for ${new Date(application.interviewAt).toLocaleDateString()}`}
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {applications.length === 0 
              ? "You haven't applied to any jobs yet."
              : "Try adjusting your search or filter criteria."
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default CandidateApplications
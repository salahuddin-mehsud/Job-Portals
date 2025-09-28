import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, MapPin, DollarSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { jobService } from '../../services/jobService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

const CompanyJobPostings = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  })

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await jobService.getCompanyJobs()
      if (response.success) {
        setJobs(response.data.jobs)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        // Implement delete functionality
        console.log('Delete job:', jobId)
        setJobs(jobs.filter(job => job._id !== jobId))
      } catch (error) {
        console.error('Failed to delete job:', error)
      }
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = !filters.status || job.status === filters.status
    const matchesSearch = !filters.search || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return <LoadingSpinner text="Loading your job postings..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600 mt-2">Manage your company's job openings</p>
        </div>
        <Link
          to="/company/jobs/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Post New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs..."
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
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-6">
        {filteredJobs.map((job) => (
          <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Eye className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {job.views} views
                    </span>
                    <span>{job.applications?.length || 0} applications</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  job.status === 'active' ? 'bg-green-100 text-green-800' :
                  job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
                <div className="flex space-x-1">
                  <Link
                    to={`/company/jobs/${job._id}/edit`}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-gray-700 line-clamp-2 mb-4">{job.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {job.employmentType}
              </div>
              <div className="flex items-center">
                <DollarSign size={16} className="mr-2" />
                ${job.salaryRange?.min?.toLocaleString()} - ${job.salaryRange?.max?.toLocaleString()}
              </div>
              <div className="flex items-center">
                <Eye size={16} className="mr-2" />
                Expires {new Date(job.expiresAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                {job.requirements?.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {job.requirements?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    +{job.requirements.length - 3} more
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/company/jobs/${job._id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Details
                </Link>
                <Link
                  to={`/company/applications?job=${job._id}`}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View Applications ({job.applications?.length || 0})
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Eye className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No job postings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {jobs.length === 0 
              ? "Get started by posting your first job opening."
              : "Try adjusting your search or filter criteria."
            }
          </p>
          {jobs.length === 0 && (
            <Link
              to="/company/jobs/new"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              Post Your First Job
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default CompanyJobPostings
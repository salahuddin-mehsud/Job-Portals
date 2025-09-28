import React, { useState, useEffect } from 'react'
import { Search, Filter, Briefcase, Building, MapPin, DollarSign, Clock, Trash2 } from 'lucide-react'
import { adminService } from '../../services/adminService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

const AdminJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  })

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await adminService.getJobs()
      if (response.success) {
        setJobs(response.data.jobs)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filters.status || job.status === filters.status
    const matchesType = !filters.type || job.employmentType === filters.type
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await adminService.deleteJob(jobId)
        if (response.success) {
          setJobs(jobs.filter(job => job._id !== jobId))
        }
      } catch (error) {
        console.error('Failed to delete job:', error)
      }
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading jobs..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs by title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.company?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  job.status === 'active' ? 'bg-green-100 text-green-800' :
                  job.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete Job"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-gray-700 line-clamp-2 mb-4">{job.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Briefcase size={16} className="mr-1" />
                {job.employmentType}
              </div>
              <div className="flex items-center">
                <DollarSign size={16} className="mr-1" />
                ${job.salaryRange?.min?.toLocaleString()} - ${job.salaryRange?.max?.toLocaleString()}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                {new Date(job.createdAt).toLocaleDateString()}
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
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}

export default AdminJobs
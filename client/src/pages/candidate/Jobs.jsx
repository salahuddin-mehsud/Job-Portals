import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Briefcase, DollarSign, Clock, Bookmark } from 'lucide-react'
import { jobService } from '../../services/jobService.js'
import JobCard from '../../components/common/JobCard.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants.js'


const CandidateJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    employmentType: '',
    experience: '',
    remote: false
  })

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await jobService.getJobs()
      console.log('Jobs response:', response)
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
    const matchesSearch = !filters.search || 
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesLocation = !filters.location || 
      job.location.toLowerCase().includes(filters.location.toLowerCase())
    
    const matchesType = !filters.employmentType || job.employmentType === filters.employmentType
    const matchesExperience = !filters.experience || job.experienceLevel === filters.experience
    const matchesRemote = !filters.remote || job.location.toLowerCase().includes('remote')
    
    return matchesSearch && matchesLocation && matchesType && matchesExperience && matchesRemote
  })

  const handleApply = (jobId) => {
    // Job application is handled in JobCard component
    console.log('Applied to job:', jobId)
  }

  if (loading) {
    return <LoadingSpinner text="Loading jobs..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
          <p className="text-gray-600 mt-2">Discover opportunities that match your skills and interests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filters.employmentType}
            onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Types</option>
            {JOB_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          <select
            value={filters.experience}
            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Experience</option>
            {EXPERIENCE_LEVELS.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="remote"
            checked={filters.remote}
            onChange={(e) => setFilters({ ...filters, remote: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remote" className="ml-2 text-sm text-gray-700">
            Remote jobs only
          </label>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-blue-500">
            <option>Most Relevant</option>
            <option>Newest</option>
            <option>Highest Salary</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map(job => (
          <JobCard key={job._id} job={job} onApply={handleApply} />
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

export default CandidateJobs
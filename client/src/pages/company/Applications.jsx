import React, { useState, useEffect } from 'react'
import { Search, Filter, Mail, Calendar, Download, User, FileText } from 'lucide-react'
import { applicationService } from '../../services/applicationService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from '../../utils/constants.js'

const CompanyApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    job: ''
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

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const response = await applicationService.updateApplicationStatus(applicationId, { status })
      if (response.success) {
        setApplications(applications.map(app => 
          app._id === applicationId ? response.data : app
        ))
      }
    } catch (error) {
      console.error('Failed to update application status:', error)
    }
  }

  const filteredApplications = applications.filter(application => {
    const matchesStatus = !filters.status || application.status === filters.status
    const matchesSearch = !filters.search || 
      application.candidate?.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      application.job?.title.toLowerCase().includes(filters.search.toLowerCase())
    const matchesJob = !filters.job || application.job?._id === filters.job
    
    return matchesStatus && matchesSearch && matchesJob
  })

  const uniqueJobs = [...new Map(applications.map(app => [app.job?._id, app.job])).values()]

  if (loading) {
    return <LoadingSpinner text="Loading applications..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600 mt-2">Manage and review candidate applications</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download size={16} className="mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by candidate name or job title..."
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
          <select
            value={filters.job}
            onChange={(e) => setFilters({ ...filters, job: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Jobs</option>
            {uniqueJobs.filter(job => job).map(job => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {application.candidate?.name?.charAt(0) || 'C'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {application.candidate?.name || 'Unknown Candidate'}
                        </div>
                        <div className="text-sm text-gray-500">{application.candidate?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.job?.title}</div>
                    <div className="text-sm text-gray-500">{application.job?.company?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${application.matchScore || 0}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {application.matchScore || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={application.status}
                      onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        APPLICATION_STATUS_COLORS[application.status]
                      }`}
                    >
                      {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        title="View Resume"
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        title="Send Message"
                        className="text-green-600 hover:text-green-900 p-1"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        title="Schedule Interview"
                        className="text-purple-600 hover:text-purple-900 p-1"
                      >
                        <Calendar size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {applications.length === 0 
                ? "You haven't received any applications yet."
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyApplications
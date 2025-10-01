import React, { useState, useEffect } from 'react'
import { Search, Filter, Calendar, MapPin, Building, Clock, FileText, X, User, Mail, Phone, Globe, DollarSign, Briefcase, Award, CheckCircle, AlertCircle, Clock as ClockIcon } from 'lucide-react'
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
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    loadApplications()
  }, [])
// Helpers — put these inside the component (or import from a shared util)
const getResumeUrl = (resume) => {
  if (!resume) return null;
  if (typeof resume === 'string') return resume;
  // common keys we might receive from server/cloudinary
  return resume.downloadUrl || resume.download_url || resume.url || resume.secure_url || null;
}

const downloadFile = async (url, filename = 'resume.pdf') => {
  if (!url) return;
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error('Network response not ok');
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    // fallback: open in new tab (Cloudinary download_url should trigger attachment)
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

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

  const handleViewDetails = (application) => {
    setSelectedApplication(application)
    setShowDetailsModal(true)
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
      case 'rejected': return <X className="text-red-600" size={16} />
      default: return <FileText className="text-gray-600" size={16} />
    }
  }

  const getStatusTimeline = (application) => {
    const timeline = [
      {
        status: 'applied',
        date: application.appliedAt,
        label: 'Application Submitted',
        completed: true
      },
      {
        status: 'viewed',
        date: application.viewedAt,
        label: 'Application Viewed',
        completed: !!application.viewedAt
      },
      {
        status: 'interview',
        date: application.interviewAt,
        label: 'Interview Scheduled',
        completed: !!application.interviewAt
      },
      {
        status: 'hired',
        date: application.hiredAt,
        label: 'Offer Extended',
        completed: !!application.hiredAt
      }
    ]

    return timeline
  }

  const formatInterviewDetails = (application) => {
    if (!application.interviewDetails) return null

    return {
      date: application.interviewDetails.date ? new Date(application.interviewDetails.date).toLocaleDateString() : 'Not specified',
      time: application.interviewDetails.time || 'Not specified',
      duration: application.interviewDetails.duration ? `${application.interviewDetails.duration} minutes` : 'Not specified',
      location: application.interviewDetails.location || 'Not specified',
      notes: application.interviewDetails.notes || 'No additional notes',
      interviewer: application.interviewDetails.interviewer || 'Not specified',
      type: application.interviewDetails.type || 'Not specified'
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
        <div className="text-sm text-gray-500">
          {applications.length} application{applications.length !== 1 ? 's' : ''} total
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {applications.filter(app => app.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {applications.filter(app => app.status === 'interview').length}
          </div>
          <div className="text-sm text-gray-500">Interview</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {applications.filter(app => app.status === 'hired').length}
          </div>
          <div className="text-sm text-gray-500">Hired</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {applications.filter(app => app.status === 'rejected').length}
          </div>
          <div className="text-sm text-gray-500">Rejected</div>
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
          <div key={application._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
                {application.hiredAt && ` • Hired on ${new Date(application.hiredAt).toLocaleDateString()}`}
                {application.rejectedAt && ` • Rejected on ${new Date(application.rejectedAt).toLocaleDateString()}`}
              </div>
              <button 
                onClick={() => handleViewDetails(application)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View Details
                <FileText size={16} className="ml-1" />
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

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Job Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedApplication.job?.title}</h4>
                    <p className="text-gray-600">{selectedApplication.job?.company?.name}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      {selectedApplication.job?.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-2 text-gray-400" />
                      {selectedApplication.job?.employmentType || 'Full-time'}
                    </div>
                    {selectedApplication.job?.salary && (
                      <div className="flex items-center">
                        <DollarSign size={16} className="mr-2 text-gray-400" />
                        {selectedApplication.job.salary}
                      </div>
                    )}
                  </div>
                </div>
                {selectedApplication.job?.description && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedApplication.job.description}</p>
                  </div>
                )}
              </div>

              {/* Application Status & Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
                <div className="flex items-center mb-4">
                  {getStatusIcon(selectedApplication.status)}
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${APPLICATION_STATUS_COLORS[selectedApplication.status]}`}>
                    {APPLICATION_STATUS_LABELS[selectedApplication.status]}
                  </span>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  {getStatusTimeline(selectedApplication).map((item, index) => (
                    <div key={item.status} className="flex items-center">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {item.completed ? <CheckCircle size={16} /> : <ClockIcon size={16} />}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">
                          {item.date ? new Date(item.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Details */}
              {selectedApplication.interviewDetails && (
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="mr-2 text-blue-600" size={20} />
                    Interview Details
                  </h3>
                  {(() => {
                    const interview = formatInterviewDetails(selectedApplication)
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">Date & Time</p>
                          <p className="text-gray-700">{interview.date} at {interview.time}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Duration</p>
                          <p className="text-gray-700">{interview.duration}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Location/Type</p>
                          <p className="text-gray-700">{interview.location}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Interviewer</p>
                          <p className="text-gray-700">{interview.interviewer}</p>
                        </div>
                        {interview.notes && interview.notes !== 'No additional notes' && (
                          <div className="md:col-span-2">
                            <p className="font-medium text-gray-900">Additional Notes</p>
                            <p className="text-gray-700 whitespace-pre-wrap">{interview.notes}</p>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Application Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Letter */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Letter</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedApplication.coverLetter || 'No cover letter provided.'}
                    </p>
                  </div>
                </div>

                {/* Application Metrics */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Match Score</p>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${selectedApplication.matchScore || 0}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {selectedApplication.matchScore || 0}%
                        </span>
                      </div>
                    </div>
                  {selectedApplication.resume && (() => {
  const url = getResumeUrl(selectedApplication.resume);
  if (!url) return null;
  const filename = `${selectedApplication.candidate?.name || 'resume'}.pdf`;
  return (
    <button
      onClick={() => downloadFile(url, filename)}
      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
    >
      <FileText size={16} className="mr-2" />
      Download Resume
    </button>
  );
})()}

                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-2">Applied On</p>
                      <p className="text-sm text-gray-700">
                        {new Date(selectedApplication.appliedAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Company</p>
                    <p className="text-gray-700">{selectedApplication.job?.company?.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-700">{selectedApplication.job?.company?.email || 'Not provided'}</p>
                  </div>
                  {selectedApplication.job?.company?.phone && (
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-700">{selectedApplication.job.company.phone}</p>
                    </div>
                  )}
                  {selectedApplication.job?.company?.website && (
                    <div>
                      <p className="font-medium text-gray-900">Website</p>
                      <a 
                        href={selectedApplication.job.company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {selectedApplication.job.company.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateApplications
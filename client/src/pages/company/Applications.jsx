import React, { useState, useEffect } from 'react'
import { Search, Filter, Mail, Calendar, Download, User, FileText, X, Send, Clock, MapPin } from 'lucide-react'
import { applicationService } from '../../services/applicationService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_COLORS } from '../../utils/constants.js'

const CompanyApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    job: ''
  })
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [messageData, setMessageData] = useState({
    subject: '',
    body: ''
  })
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    duration: '30',
    location: '',
    notes: ''
  })
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

  const handleSendMessage = (application) => {
    setSelectedApplication(application)
    setMessageData({
      subject: `Regarding your application for ${application.job?.title}`,
      body: `Hi ${application.candidate?.name},\n\n`
    })
    setShowMessageModal(true)
  }

  const handleScheduleInterview = (application) => {
    setSelectedApplication(application)
    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setScheduleData({
      date: tomorrow.toISOString().split('T')[0],
      time: '10:00',
      duration: '30',
      location: 'Video Call',
      notes: `Interview for ${application.job?.title} position`
    })
    setShowScheduleModal(true)
  }

  const sendMessage = async () => {
    if (!selectedApplication || !messageData.subject || !messageData.body) return

    try {
      // Here you would integrate with your email service or messaging system
      console.log('Sending message:', {
        to: selectedApplication.candidate?.email,
        ...messageData
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert('Message sent successfully!')
      setShowMessageModal(false)
      setMessageData({ subject: '', body: '' })
      setSelectedApplication(null)
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const scheduleInterview = async () => {
    if (!selectedApplication || !scheduleData.date || !scheduleData.time) return

    try {
      // Here you would integrate with your calendar service
      console.log('Scheduling interview:', {
        candidate: selectedApplication.candidate?.name,
        job: selectedApplication.job?.title,
        ...scheduleData
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update application status to interview
      await updateApplicationStatus(selectedApplication._id, 'interview')

      alert('Interview scheduled successfully!')
      setShowScheduleModal(false)
      setScheduleData({ date: '', time: '', duration: '30', location: '', notes: '' })
      setSelectedApplication(null)
    } catch (error) {
      console.error('Failed to schedule interview:', error)
      alert('Failed to schedule interview. Please try again.')
    }
  }

  const exportToCSV = async () => {
    setExportLoading(true)
    try {
      // Get all applications for export (without filters)
      const response = await applicationService.getApplications()
      const allApplications = response.success ? response.data.applications : []
      
      // Define CSV headers
      const headers = [
        'Candidate Name',
        'Candidate Email',
        'Candidate Phone',
        'Job Title',
        'Job Department',
        'Job Type',
        'Applied Date',
        'Status',
        'Match Score',
        'Resume URL',
        'Cover Letter',
        'Experience Level',
        'Current Position',
        'Current Company',
        'Skills'
      ]

      // Convert applications to CSV rows
      const csvData = allApplications.map(app => [
        `"${app.candidate?.name || 'N/A'}"`,
        `"${app.candidate?.email || 'N/A'}"`,
        `"${app.candidate?.phone || 'N/A'}"`,
        `"${app.job?.title || 'N/A'}"`,
        `"${app.job?.department || 'N/A'}"`,
        `"${app.job?.employmentType || 'N/A'}"`,
        `"${new Date(app.appliedAt).toLocaleDateString()}"`,
        `"${APPLICATION_STATUS_LABELS[app.status] || app.status}"`,
        `"${app.matchScore || 0}%"`,
        `"${app.resume || 'N/A'}"`,
        `"${app.coverLetter || 'N/A'}"`,
        `"${app.candidate?.experienceLevel || 'N/A'}"`,
        `"${app.candidate?.currentPosition || 'N/A'}"`,
        `"${app.candidate?.currentCompany || 'N/A'}"`,
        `"${(app.candidate?.skills || []).join(', ')}"`
      ])

      // Combine headers and data
      const csvContent = [headers.join(','), ...csvData].join('\n')

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Failed to export CSV:', error)
      alert('Failed to export applications. Please try again.')
    } finally {
      setExportLoading(false)
    }
  }

  const filteredApplications = applications.filter(application => {
    const matchesStatus = !filters.status || application.status === filters.status
    const matchesSearch = !filters.search || 
      application.candidate?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      application.job?.title?.toLowerCase().includes(filters.search.toLowerCase())
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
        <button 
          onClick={exportToCSV}
          disabled={exportLoading || applications.length === 0}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} className="mr-2" />
          {exportLoading ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
          <div className="text-sm text-gray-500">Total Applications</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {applications.filter(app => app.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-500">Pending Review</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">
            {applications.filter(app => app.status === 'hired').length}
          </div>
          <div className="text-sm text-gray-500">Hired</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">
            {applications.filter(app => app.status === 'rejected').length}
          </div>
          <div className="text-sm text-gray-500">Rejected</div>
        </div>
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
                        {application.candidate?.phone && (
                          <div className="text-sm text-gray-500">{application.candidate.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.job?.title}</div>
                    <div className="text-sm text-gray-500">{application.job?.company?.name}</div>
                    {application.job?.department && (
                      <div className="text-sm text-gray-500">{application.job.department}</div>
                    )}
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
                   {application.resume && (() => {
  // helper locally — you can also import a shared util
  const getResumeUrl = (resume) => {
    if (!resume) return null;
    if (typeof resume === 'string') return resume;
    return resume.url || resume.secure_url || resume.downloadUrl || resume.download_url || null;
  };
  const url = getResumeUrl(application.resume);
  if (!url) return null;

  // Use download attribute to force download, or open in new tab:
  return (
    <button
      onClick={async () => {
        try {
          // best UX: force-download by fetching blob then downloading
          const res = await fetch(url, { mode: 'cors' });
          if (!res.ok) { window.open(url, '_blank'); return; }
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          const filename = `${application.candidate?.name || 'resume'}.pdf`;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(blobUrl);
        } catch (err) {
          // fallback
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }}
      title="Download Resume"
      className="text-blue-600 hover:text-blue-900 p-1"
    >
      <FileText size={16} />
    </button>
  );
})()}

                      <button
                        onClick={() => handleSendMessage(application)}
                        title="Send Message"
                        className="text-green-600 hover:text-green-900 p-1"
                      >
                        <Mail size={16} />
                      </button>
                      <button
                        onClick={() => handleScheduleInterview(application)}
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

      {/* Message Modal */}
      {showMessageModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Send Message</h3>
              <button 
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                To: {selectedApplication.candidate?.name} ({selectedApplication.candidate?.email})
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={messageData.subject}
                  onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={messageData.body}
                  onChange={(e) => setMessageData({...messageData, body: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Type your message here..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={sendMessage}
                disabled={!messageData.subject || !messageData.body}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send size={16} className="mr-2" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Schedule Interview</h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                With: {selectedApplication.candidate?.name}
              </p>
              <p className="text-sm text-gray-600">
                Position: {selectedApplication.job?.title}
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduleData.time}
                    onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  value={scheduleData.duration}
                  onChange={(e) => setScheduleData({...scheduleData, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={scheduleData.location}
                  onChange={(e) => setScheduleData({...scheduleData, location: e.target.value})}
                  placeholder="Video Call, Office Address, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={scheduleData.notes}
                  onChange={(e) => setScheduleData({...scheduleData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Additional notes for the candidate..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={scheduleInterview}
                disabled={!scheduleData.date || !scheduleData.time}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Calendar size={16} className="mr-2" />
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyApplications
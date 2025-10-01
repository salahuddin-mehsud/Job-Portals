// components/common/ApplicationForm.jsx
import React, { useState } from 'react'
import { X, Upload, FileText, User, Mail, Phone, Briefcase } from 'lucide-react'
import { applicationService } from '../../services/applicationService.js'
import { useAuth } from '../../hooks/useAuth.js'
import toast from 'react-hot-toast'

const ApplicationForm = ({ job, onSuccess, onCancel }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPosition: user?.currentPosition || '',
    currentCompany: user?.currentCompany || '',
    coverLetter: '',
    resume: null
  })
  const [resumePreview, setResumePreview] = useState(user?.resume || '')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setFormData(prev => ({ ...prev, resume: file }))
      setResumePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.email || !formData.coverLetter) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!formData.resume && !user?.resume) {
      toast.error('Please upload your resume')
      return
    }

    setLoading(true)
    try {
      const submitData = new FormData()
      submitData.append('fullName', formData.fullName)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone || '')
      submitData.append('currentPosition', formData.currentPosition || '')
      submitData.append('currentCompany', formData.currentCompany || '')
      submitData.append('coverLetter', formData.coverLetter)
      
      if (formData.resume) {
        submitData.append('resume', formData.resume)
      }

      const response = await applicationService.submitApplication(job._id, submitData)
      
      if (response.success) {
        onSuccess()
      }
    } catch (error) {
      console.error('Failed to submit application:', error)
      toast.error(error.response?.data?.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
              <p className="text-gray-600">{job.company?.name}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="mr-2" size={20} />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Current Employment */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="mr-2" size={20} />
                Current Employment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Position
                  </label>
                  <input
                    type="text"
                    name="currentPosition"
                    value={formData.currentPosition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Company
                  </label>
                  <input
                    type="text"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="mr-2" size={20} />
                Resume *
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {resumePreview ? (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <FileText size={20} />
                    <span>Resume uploaded</span>
                    <button
                      type="button"
                      onClick={() => {
                        setResumePreview('')
                        setFormData(prev => ({ ...prev, resume: null }))
                      }}
                      className="text-red-600 hover:text-red-700 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : user?.resume ? (
                  <div className="text-green-600">
                    Using your profile resume
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="resume-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Upload Resume
                      </label>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      PDF files only, max 5MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cover Letter *
              </h3>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={6}
                placeholder="Explain why you're a good fit for this position..."
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              />
              <p className="mt-2 text-sm text-gray-500">
                {formData.coverLetter.length} characters
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ApplicationForm
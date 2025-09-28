import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, X, Plus, Trash2, DollarSign, MapPin, Calendar } from 'lucide-react'
import { jobService } from '../../services/jobService.js'
import { useAuth } from '../../hooks/useAuth.js'
import toast from 'react-hot-toast'

const NewJob = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    location: '',
    salaryRange: {
      min: '',
      max: '',
      currency: 'USD'
    },
    employmentType: 'full-time',
    category: 'Technology',
    keywords: []
  })

  const employmentTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
  ]

  const categories = [
    'Technology', 'Marketing', 'Sales', 'Design', 'Finance', 
    'HR', 'Operations', 'Healthcare', 'Education', 'Other'
  ]

  const handleAddRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }))
  }

  const handleRemoveRequirement = (index) => {
    if (formData.requirements.length > 1) {
      setFormData(prev => ({
        ...prev,
        requirements: prev.requirements.filter((_, i) => i !== index)
      }))
    }
  }

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements
    }))
  }

  const handleAddResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, '']
    }))
  }

  const handleRemoveResponsibility = (index) => {
    if (formData.responsibilities.length > 1) {
      setFormData(prev => ({
        ...prev,
        responsibilities: prev.responsibilities.filter((_, i) => i !== index)
      }))
    }
  }

  const handleResponsibilityChange = (index, value) => {
    const newResponsibilities = [...formData.responsibilities]
    newResponsibilities[index] = value
    setFormData(prev => ({
      ...prev,
      responsibilities: newResponsibilities
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Filter out empty requirements and responsibilities
      const payload = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        responsibilities: formData.responsibilities.filter(resp => resp.trim() !== ''),
        salaryRange: {
          min: parseInt(formData.salaryRange.min),
          max: parseInt(formData.salaryRange.max),
          currency: formData.salaryRange.currency
        },
        company: user._id
      }

      const response = await jobService.createJob(payload)
      if (response.success) {
        toast.success('Job posted successfully!')
        navigate('/company/jobs')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  const addKeyword = () => {
    const keyword = prompt('Enter a keyword:')
    if (keyword && keyword.trim()) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword.trim()]
      }))
    }
  }

  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600 mt-2">Fill in the details to create a new job posting</p>
        </div>
        <button
          onClick={() => navigate('/company/jobs')}
          className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <X size={16} className="mr-2" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g., Senior Frontend Developer"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Describe the role, team, and company culture..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements *
            </label>
            <div className="space-y-2">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder={`Requirement ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
                    disabled={formData.requirements.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddRequirement}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} className="mr-1" />
                Add Requirement
              </button>
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsibilities
            </label>
            <div className="space-y-2">
              {formData.responsibilities.map((responsibility, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={responsibility}
                    onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder={`Responsibility ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
                    disabled={formData.responsibilities.length <= 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} className="mr-1" />
                Add Responsibility
              </button>
            </div>
          </div>

          {/* Location and Employment Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Remote, New York, NY"
                />
              </div>
            </div>
            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type *
              </label>
              <select
                id="employmentType"
                required
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {employmentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary Range (USD) *
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  required
                  value={formData.salaryRange.min}
                  onChange={(e) => setFormData({
                    ...formData,
                    salaryRange: { ...formData.salaryRange, min: e.target.value }
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Minimum salary"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  required
                  value={formData.salaryRange.max}
                  onChange={(e) => setFormData({
                    ...formData,
                    salaryRange: { ...formData.salaryRange, max: e.target.value }
                  })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Maximum salary"
                />
              </div>
              <select
                value={formData.salaryRange.currency}
                onChange={(e) => setFormData({
                  ...formData,
                  salaryRange: { ...formData.salaryRange, currency: e.target.value }
                })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {/* Category and Keywords */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.keywords.map((keyword, index) => (
                  <span key={index} className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={addKeyword}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                <Plus size={14} className="mr-1" />
                Add Keyword
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/company/jobs')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default NewJob
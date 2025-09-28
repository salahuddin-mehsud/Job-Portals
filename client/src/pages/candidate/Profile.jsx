// src/pages/candidate/Profile.jsx
import React, { useState, useEffect } from 'react'
import { Camera, MapPin, Mail, Phone, Globe, Edit, Save, Plus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { authService } from '../../services/auth.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const CandidateProfile = () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    portfolio: '',
    skills: [],
    education: [],
    experience: []
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        portfolio: (user.portfolioLinks && user.portfolioLinks[0]) || '',
        skills: user.skills || [],
        education: user.education || [],
        experience: user.experience || []
      })
    }
  }, [user])

  // Allowed fields to send to backend (must match userController.updateProfile)
  const ALLOWED_FIELDS = [
    'name',
    'bio',
    'skills',
    'avatar',
    'portfolioLinks',
    'education',
    'experience',
    'resume'
  ]

  // Build payload from formData but only include allowed fields
  const buildPayload = (data) => {
    const payload = {}

    // name & bio
    if (data.name !== undefined) payload.name = data.name
    if (data.bio !== undefined) payload.bio = data.bio

    // skills: ensure array
    if (Array.isArray(data.skills)) {
      payload.skills = data.skills
    } else if (typeof data.skills === 'string' && data.skills.trim()) {
      // If user stored as comma-separated in future, convert
      payload.skills = data.skills.split(',').map(s => s.trim()).filter(Boolean)
    }

    // portfolio -> portfolioLinks array expected by backend
    if (data.portfolio && data.portfolio.trim()) {
      payload.portfolioLinks = [data.portfolio.trim()]
    }

    // education & experience (send if present)
    if (Array.isArray(data.education)) payload.education = data.education
    if (Array.isArray(data.experience)) payload.experience = data.experience

    // Note: avatar and resume not handled by UI here; leaving hooks for them
    // If you later add avatar/resume upload, set payload.avatar / payload.resume appropriately

    // Filter down to exactly ALLOWED_FIELDS (in case we added extras)
    const filtered = {}
    ALLOWED_FIELDS.forEach((key) => {
      if (payload[key] !== undefined) filtered[key] = payload[key]
    })

    return filtered
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = buildPayload(formData)
      // Debug: see what we send
      console.debug('Updating profile with payload:', payload)

      const response = await authService.updateProfile(payload)
      // api wrapper returns the parsed object (response.success, response.data)
      if (response?.success) {
        updateUser(response.data)
        setEditing(false)
        toast.success('Profile updated successfully!')
      } else {
        console.error('Profile update failed (response):', response)
        toast.error(response?.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update failed:', error)
      // Axios errors often have `error.response`
      if (error?.response) {
        console.error('Server response:', error.response.data)
        toast.error(error.response.data?.message || 'Failed to update profile (server)')
      } else {
        toast.error('Failed to update profile')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = () => {
    const skill = prompt('Enter a skill:')
    if (skill && skill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }))
    }
  }

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        current: false
      }]
    }))
  }

  const handleEducationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  if (!user) {
    return <LoadingSpinner text="Loading your profile..." />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your professional information</p>
        </div>
        <button
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            'Saving...'
          ) : editing ? (
            <>
              <Save size={16} className="mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit size={16} className="mr-2" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {user.name?.charAt(0) || 'U'}
            </div>
            {editing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                <Camera size={16} />
              </button>
            )}
          </div>
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            )}
            <p className="text-gray-600 mt-1">{user.bio || 'Add a professional bio'}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              {user.location && (
                <span className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {user.location}
                </span>
              )}
              <span className="flex items-center">
                <Mail size={14} className="mr-1" />
                {user.email}
              </span>
            </div>
          </div>
        </div>

        {editing && (
          <div className="mt-4">
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Write a professional bio..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              rows={3}
            />
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
              {editing && (
                <button
                  onClick={handleAddSkill}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} className="mr-1" />
                  Add Skill
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span key={index} className="relative px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill}
                  {editing && (
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {formData.skills.length === 0 && !editing && (
                <p className="text-gray-500">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
              {editing && (
                <button
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    experience: [...prev.experience, {
                      title: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      current: false,
                      description: ''
                    }]
                  }))}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} className="mr-1" />
                  Add Experience
                </button>
              )}
            </div>
            <div className="space-y-4">
              {formData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-4">
                  {editing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => {
                          const newExp = [...formData.experience]
                          newExp[index].title = e.target.value
                          setFormData({ ...formData, experience: newExp })
                        }}
                        placeholder="Job Title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...formData.experience]
                          newExp[index].company = e.target.value
                          setFormData({ ...formData, experience: newExp })
                        }}
                        placeholder="Company"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                      {exp.description && (
                        <p className="text-gray-700 mt-2">{exp.description}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
              {formData.experience.length === 0 && !editing && (
                <p className="text-gray-500">No experience added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail size={16} className="mr-3" />
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span>{user.email}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone size={16} className="mr-3" />
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span>{user.phone || 'Not provided'}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-3" />
                {editing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Location"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span>{user.location || 'Not provided'}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600">
                <Globe size={16} className="mr-3" />
                {editing ? (
                  <input
                    type="url"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="Portfolio URL"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span>{user.portfolioLinks?.[0] || 'Not provided'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              {editing && (
                <button
                  onClick={handleAddEducation}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} className="mr-1" />
                  Add Education
                </button>
              )}
            </div>
            <div className="space-y-3">
              {formData.education.map((edu, index) => (
                <div key={index}>
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        placeholder="Institution"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        placeholder="Degree"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold text-sm">{edu.institution}</h4>
                      <p className="text-sm text-gray-600">{edu.degree}</p>
                      <p className="text-xs text-gray-500">
                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                      </p>
                    </>
                  )}
                </div>
              ))}
              {formData.education.length === 0 && !editing && (
                <p className="text-gray-500 text-sm">No education added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateProfile

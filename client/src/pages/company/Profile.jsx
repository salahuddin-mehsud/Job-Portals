import React, { useState, useEffect } from 'react'
import { Camera, MapPin, Mail, Globe, Building, Users, Edit, Save } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { companyService } from '../../services/companyService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import toast from 'react-hot-toast'

const CompanyProfile = () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [preview, setPreview] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    industry: '',
    location: '',
    website: '',
    size: '',
    founded: '',
    socialMedia: {
      linkedin: '',
      twitter: '',
      facebook: ''
    }
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        industry: user.industry || '',
        location: user.location || '',
        website: user.website || '',
        size: user.size || '',
        founded: user.founded || '',
        socialMedia: user.socialMedia || {
          linkedin: '',
          twitter: '',
          facebook: ''
        }
      })
      setPreview(user.avatar || null)
    }
  }, [user])

  // Allowed keys on backend (must match companyController.updateProfile)
  const ALLOWED_FIELDS = ['name', 'bio', 'avatar', 'industry', 'location', 'website', 'size', 'founded', 'socialMedia']

  // Filter formData to allowed fields only
  const buildPayload = (data) => {
    const payload = {}
    ALLOWED_FIELDS.forEach(key => {
      if (key in data) {
        payload[key] = data[key]
      }
    })
    // Ensure socialMedia is an object (backend expects it if provided)
    if (payload.socialMedia && typeof payload.socialMedia !== 'object') {
      payload.socialMedia = {}
    }
    return payload
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = buildPayload(formData)
      const response = await companyService.updateProfile(payload)
      if (response?.success) {
        updateUser(response.data)
        setEditing(false)
        toast.success('Company profile updated successfully!')
      } else {
        console.error('Profile update failed (response):', response)
        toast.error(response?.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update failed:', error)
      if (error?.response) {
        console.error('Server response data:', error.response.data)
        toast.error(error.response.data?.message || 'Failed to update profile (server rejected request)')
      } else {
        toast.error('Failed to update profile')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // optional: client-side size/type checks
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }
    setUploading(true)
    try {
      const resp = await companyService.uploadAvatar(file)
      if (resp?.success) {
        // resp.data should be updated company
        updateUser(resp.data)
        setPreview(resp.data.avatar || null)
        toast.success('Avatar updated')
      } else {
        toast.error(resp?.message || 'Upload failed')
      }
    } catch (err) {
      console.error('Company avatar upload error', err)
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      // clear file input value to allow same file reupload if needed
      e.target.value = ''
    }
  }

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Hospitality', 'Real Estate', 'Transportation', 'Energy'
  ]

  if (!user) {
    return <LoadingSpinner text="Loading company profile..." />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-2">Manage your company information</p>
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
            {/* Avatar or placeholder */}
            {preview ? (
              <img
                src={preview}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                {user.name?.charAt(0) || 'C'}
              </div>
            )}

            {/* Hidden file input */}
            {editing && (
              <>
                <input
                  id="companyAvatarUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarSelect}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('companyAvatarUpload').click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white"
                  title={uploading ? 'Uploading...' : 'Change avatar'}
                  disabled={uploading}
                >
                  <Camera size={16} />
                </button>
              </>
            )}
          </div>

          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            )}
            <p className="text-gray-600 mt-1">{user.industry || 'Add industry'}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              {user.location && (
                <span className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {user.location}
                </span>
              )}
              {user.size && (
                <span className="flex items-center">
                  <Users size={14} className="mr-1" />
                  {user.size} employees
                </span>
              )}
              {user.founded && (
                <span className="flex items-center">
                  <Building size={14} className="mr-1" />
                  Founded {user.founded}
                </span>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="mt-4">
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Write about your company..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              rows={3}
            />
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                {editing ? (
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{user.industry || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                {editing ? (
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Size</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size} employees</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{user.size ? `${user.size} employees` : 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Founded</label>
                {editing ? (
                  <input
                    type="number"
                    value={formData.founded}
                    onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 2020"
                  />
                ) : (
                  <p className="text-gray-900">{user.founded || 'Not specified'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., San Francisco, CA"
                  />
                ) : (
                  <p className="text-gray-900">{user.location || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Mail size={16} className="mr-2" />
                    {user.email}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="https://example.com"
                  />
                ) : (
                  <div className="flex items-center text-blue-600 hover:text-blue-800">
                    <Globe size={16} className="mr-2" />
                    {user.website || 'Not specified'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Social Media */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.socialMedia.linkedin}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, linkedin: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="https://linkedin.com/company/..."
                  />
                ) : (
                  <p className="text-gray-900">{user.socialMedia?.linkedin || 'Not added'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="https://twitter.com/..."
                  />
                ) : (
                  <p className="text-gray-900">{user.socialMedia?.twitter || 'Not added'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                {editing ? (
                  <input
                    type="url"
                    value={formData.socialMedia.facebook}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, facebook: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="https://facebook.com/..."
                  />
                ) : (
                  <p className="text-gray-900">{user.socialMedia?.facebook || 'Not added'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Jobs</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Applications</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="font-semibold">2,345</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Followers</span>
                <span className="font-semibold">1,234</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyProfile

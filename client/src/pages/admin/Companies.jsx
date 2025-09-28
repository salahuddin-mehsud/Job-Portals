import React, { useState, useEffect } from 'react'
import { Search, Building, Mail, Globe, MoreVertical, Ban } from 'lucide-react'
import { adminService } from '../../services/adminService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      const response = await adminService.getCompanies()
      if (response.success) {
        setCompanies(response.data.companies)
      }
    } catch (error) {
      console.error('Failed to load companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBanCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to ban this company?')) {
      try {
        const response = await adminService.banUser(companyId) // Same endpoint for companies
        if (response.success) {
          setCompanies(companies.map(company => 
            company._id === companyId ? { ...company, isBanned: true } : company
          ))
        }
      } catch (error) {
        console.error('Failed to ban company:', error)
      }
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading companies..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                  {company.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{company.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    company.isBanned
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {company.isBanned ? 'Banned' : 'Active'}
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail size={14} className="mr-2" />
                {company.email}
              </div>
              {company.industry && (
                <div className="flex items-center">
                  <Building size={14} className="mr-2" />
                  {company.industry}
                </div>
              )}
              {company.website && (
                <div className="flex items-center">
                  <Globe size={14} className="mr-2" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {company.website}
                  </a>
                </div>
              )}
              {company.location && (
                <div className="flex items-center">
                  <Building size={14} className="mr-2" />
                  {company.location}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Joined {new Date(company.createdAt).toLocaleDateString()}
              </div>
              {!company.isBanned && (
                <button
                  onClick={() => handleBanCompany(company._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  <Ban size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  )
}

export default AdminCompanies
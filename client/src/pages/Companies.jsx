import React, { useState, useEffect } from 'react'
import { Search, Filter, Building, MapPin, Users, Globe, Briefcase } from 'lucide-react'
import { companyService } from '../services/companyService.js'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    size: '',
    location: ''
  })

  useEffect(() => {
    loadCompanies()
  }, [])

 
const loadCompanies = async () => {
  try {
    const response = await companyService.getCompaniesPublic(filters)
    console.log("Companies API response:", response.data)

    // adjust here to match your backend response
    if (response.data?.companies) {
      setCompanies(response.data.companies)
    } else if (response.data?.data?.companies) {
      setCompanies(response.data.data.companies)
    } else {
      setCompanies([])
    }
  } catch (error) {
    console.error('Failed to load companies:', error)
    setCompanies([])
  } finally {
    setLoading(false)
  }
}




  const filteredCompanies = companies.filter(company => {
    const matchesSearch = !filters.search || 
      company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      company.industry?.toLowerCase().includes(filters.search.toLowerCase()) ||
      company.bio?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesIndustry = !filters.industry || company.industry === filters.industry
    const matchesSize = !filters.size || company.size === filters.size
    const matchesLocation = !filters.location || 
      company.location?.toLowerCase().includes(filters.location.toLowerCase())
    
    return matchesSearch && matchesIndustry && matchesSize && matchesLocation
  })

  const industries = [...new Set(companies.map(c => c.industry).filter(Boolean))]
  const sizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  const locations = [...new Set(companies.map(c => c.location).filter(Boolean))]

  if (loading) {
    return <LoadingSpinner text="Loading companies..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies Directory</h1>
          <p className="text-gray-600 mt-2">Discover amazing companies to work for</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by company name, industry, or description..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={filters.industry}
            onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          <select
            value={filters.size}
            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Sizes</option>
            {sizes.map(size => (
              <option key={size} value={size}>{size} employees</option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full md:w-auto"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                {company.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{company.name}</h3>
                <p className="text-sm text-gray-600">{company.industry}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              {company.location && (
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2" />
                  {company.location}
                </div>
              )}
              {company.size && (
                <div className="flex items-center">
                  <Users size={14} className="mr-2" />
                  {company.size} employees
                </div>
              )}
              {company.website && (
                <div className="flex items-center">
                  <Globe size={14} className="mr-2" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Visit Website
                  </a>
                </div>
              )}
            </div>

            <p className="text-gray-700 text-sm mb-4 line-clamp-2">{company.bio}</p>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                Follow
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 text-sm">
                View Jobs
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}

export default Companies
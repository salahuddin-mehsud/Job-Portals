import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Briefcase, Users, Building, ArrowRight, Star, TrendingUp } from 'lucide-react'
import { jobService } from '../services/jobService.js'
import JobCard from '../components/common/JobCard.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [trendingJobs, setTrendingJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const [featuredResponse, trendingResponse] = await Promise.all([
        jobService.getJobs({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' }),
        jobService.getJobs({ limit: 4, sortBy: 'views', sortOrder: 'desc' })
      ])

      if (featuredResponse.success) {
        setFeaturedJobs(featuredResponse.data.jobs)
      }
      if (trendingResponse.success) {
        setTrendingJobs(trendingResponse.data.jobs)
      }
    } catch (error) {
      console.error('Failed to load jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { icon: Briefcase, number: '10,000+', label: 'Active Jobs' },
    { icon: Users, number: '50,000+', label: 'Job Seekers' },
    { icon: Building, number: '5,000+', label: 'Companies' },
    { icon: TrendingUp, number: '95%', label: 'Success Rate' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Job
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with top companies and discover opportunities that match your skills
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-lg leading-5 bg-white/10 backdrop-blur-sm placeholder-blue-200 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Job title, keywords, or company"
                />
                <Link
                  to={`/jobs?search=${encodeURIComponent(searchQuery)}`}
                  className="absolute right-2 top-2 px-6 py-2 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                >
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-blue-600" size={32} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
              <p className="text-gray-600 mt-2">Hand-picked opportunities from top companies</p>
            </div>
            <Link
              to="/jobs"
              className="flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View all jobs <ArrowRight size={20} className="ml-1" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading featured jobs..." />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
              <p className="text-gray-600">
                Build your professional profile and showcase your skills, experience, and portfolio
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Opportunities</h3>
              <p className="text-gray-600">
                Discover jobs that match your skills and preferences with our smart matching system
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Hired</h3>
              <p className="text-gray-600">
                Connect with employers, ace your interviews, and start your dream career
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Jobs Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <TrendingUp size={32} className="mr-3" />
              <h2 className="text-3xl font-bold">Trending Now</h2>
            </div>
            <Star className="text-yellow-300" size={24} />
          </div>

          {loading ? (
            <LoadingSpinner text="Loading trending jobs..." />
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {trendingJobs.map((job, index) => (
                <div key={job._id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-blue-100">{job.company?.name}</p>
                    </div>
                    <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
                      #{index + 1} Trending
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-blue-100 mb-4">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.employmentType}</span>
                    <span>•</span>
                    <span>${job.salaryRange?.min?.toLocaleString()}+</span>
                  </div>
                  <p className="text-blue-100 line-clamp-2 mb-4">{job.description}</p>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="inline-flex items-center text-white font-semibold hover:text-blue-200"
                  >
                    View Details <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Eye, Briefcase, DollarSign, Calendar } from 'lucide-react'
import { companyService } from '../../services/companyService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

const CompanyAnalytics = () => {
  const [analytics, setAnalytics] = useState({})
  const [timeRange, setTimeRange] = useState('30days')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      const response = await companyService.getCompanyAnalytics()
      if (response.success) {
        setAnalytics(response.data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      icon: Briefcase,
      label: 'Total Jobs Posted',
      value: analytics.totals?.jobs || 0,
      change: '+12%',
      color: 'blue'
    },
    {
      icon: Users,
      label: 'Total Applications',
      value: analytics.totals?.applications || 0,
      change: '+8%',
      color: 'green'
    },
    {
      icon: Eye,
      label: 'Total Profile Views',
      value: analytics.totals?.totalViews || 0,
      change: '+15%',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      label: 'Application Rate',
      value: analytics.totals?.applications && analytics.totals?.totalViews 
        ? ((analytics.totals.applications / analytics.totals.totalViews) * 100).toFixed(1) + '%'
        : '0%',
      change: '+3%',
      color: 'orange'
    }
  ]

  if (loading) {
    return <LoadingSpinner text="Loading analytics..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your company's recruitment performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="1year">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                  <span className={`text-sm font-medium ${
                    stat.change.includes('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last period
                  </span>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Application Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
          <div className="space-y-4">
            {analytics.applicationStatus?.map((status, index) => (
              <div key={status._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status._id === 'pending' ? 'bg-yellow-500' :
                    status._id === 'viewed' ? 'bg-blue-500' :
                    status._id === 'interview' ? 'bg-purple-500' :
                    status._id === 'hired' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">{status._id}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-900 font-semibold">{status.count}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status._id === 'pending' ? 'bg-yellow-500' :
                        status._id === 'viewed' ? 'bg-blue-500' :
                        status._id === 'interview' ? 'bg-purple-500' :
                        status._id === 'hired' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}
                      style={{ 
                        width: `${(status.count / analytics.totals?.applications) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">New applications</p>
                  <p className="text-xs text-gray-600">12 new applications received</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Briefcase size={20} className="text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Job published</p>
                  <p className="text-xs text-gray-600">Senior Developer position published</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">1d ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Eye size={20} className="text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Profile views</p>
                  <p className="text-xs text-gray-600">45 new profile views</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">2d ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">24h</div>
            <div className="text-sm text-gray-600">Avg. Response Time</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">78%</div>
            <div className="text-sm text-gray-600">Interview Rate</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">15%</div>
            <div className="text-sm text-gray-600">Hire Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyAnalytics
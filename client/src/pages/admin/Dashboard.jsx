import React, { useState, useEffect } from 'react'
import { Users, Building, Briefcase, FileText, TrendingUp, AlertCircle } from 'lucide-react'
import { adminService } from '../../services/adminService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

const AdminDashboard = () => {
  const [stats, setStats] = useState({})
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await adminService.getDashboardStats()
      if (response.success) {
        setStats(response.data)
        
        // Mock recent activity for now
        setRecentActivity([
          { action: 'user_registered', user: 'John Doe', time: new Date() },
          { action: 'job_posted', company: 'Tech Corp', time: new Date(Date.now() - 300000) },
          { action: 'application_submitted', user: 'Jane Smith', time: new Date(Date.now() - 600000) }
        ])
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totals?.users || 0,
      color: 'blue',
      change: '+12%'
    },
    {
      icon: Building,
      label: 'Total Companies',
      value: stats.totals?.companies || 0,
      color: 'green',
      change: '+5%'
    },
    {
      icon: Briefcase,
      label: 'Active Jobs',
      value: stats.totals?.jobs || 0,
      color: 'purple',
      change: '+8%'
    },
    {
      icon: FileText,
      label: 'Applications',
      value: stats.totals?.applications || 0,
      color: 'orange',
      change: '+15%'
    }
  ]

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium text-${stat.change.includes('+') ? 'green' : 'red'}-600`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={16} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action === 'user_registered' && `New user registered: ${activity.user}`}
                    {activity.action === 'job_posted' && `New job posted by: ${activity.company}`}
                    {activity.action === 'application_submitted' && `Application submitted by: ${activity.user}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.time).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Storage</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">78% Used</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Active Users</span>
              <span className="text-sm text-gray-900">1,234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
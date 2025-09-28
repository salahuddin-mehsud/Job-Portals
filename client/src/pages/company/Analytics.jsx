// src/pages/company/CompanyAnalytics.jsx
import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Eye, Briefcase, Globe } from 'lucide-react'
import { companyService } from '../../services/companyService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const CompanyAnalytics = () => {
  const { user } = useAuth() // company user
  const [analytics, setAnalytics] = useState({})
  const [timeRange, setTimeRange] = useState('30days')
  const [loading, setLoading] = useState(true)

  const [followers, setFollowers] = useState({ users: [], companies: [] })
  const [following, setFollowing] = useState({ users: [], companies: [] })
  const [loadingFollowers, setLoadingFollowers] = useState(true)
  const [loadingFollowing, setLoadingFollowing] = useState(true)

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange])

  const loadAll = async () => {
    setLoading(true)
    await Promise.all([loadAnalytics(), loadFollowers(), loadFollowing()])
    setLoading(false)
  }

  const loadAnalytics = async () => {
    try {
      const resp = await companyService.getCompanyAnalytics({ range: timeRange })
      if (resp?.success) {
        setAnalytics(resp.data)
      } else {
        console.warn('Analytics response not success', resp)
        setAnalytics({})
      }
    } catch (err) {
      console.error('Failed to load analytics', err)
      setAnalytics({})
    }
  }

  const loadFollowers = async () => {
  setLoadingFollowers(true)
  try {
    if (!user?._id) {
      setFollowers({ users: [], companies: [] })
      return
    }

    const resp = await companyService.getCompanyFollowers(user._id)
    // resp expected: { success: true, data: [ ...followers array... ] }
    // But be defensive: handle resp.data being array or nested shapes.
    let raw = []

    // If interceptor returns response.data (body), resp is that object
    // Try a few possibilities:
    if (!resp) {
      raw = []
    } else if (Array.isArray(resp.data)) {
      raw = resp.data
    } else if (Array.isArray(resp.data?.data)) {
      raw = resp.data.data
    } else if (Array.isArray(resp.data?.followers)) {
      raw = resp.data.followers
    } else if (Array.isArray(resp.data)) {
      raw = resp.data
    } else if (Array.isArray(resp)) {
      raw = resp
    } else if (Array.isArray(resp.data?.data?.followers)) {
      raw = resp.data.data.followers
    } else {
      // fallback: if controller returned { success:true, data: [...] }
      raw = resp.data ?? []
    }

    // split into user vs company items (heuristic based on presence of industry/email/role)
    const users = raw.filter(r => !r.industry && (r.role === 'candidate' || r.role === 'user' || r.email))
    const companies = raw.filter(r => r.industry || r.role === 'company')

    setFollowers({ users, companies })
  } catch (err) {
    console.error('Failed loading followers', err)
    setFollowers({ users: [], companies: [] })
  } finally {
    setLoadingFollowers(false)
  }
}


const loadFollowing = async () => {
  setLoadingFollowing(true)
  try {
    const resp = await companyService.getCompanyFollowing()
    // expect: { success:true, data: { followingUsers, followingCompanies } }
    const payload = resp?.data ?? resp
    const followingUsers = payload?.followingUsers ?? payload?.data?.followingUsers ?? []
    const followingCompanies = payload?.followingCompanies ?? payload?.data?.followingCompanies ?? []
    setFollowing({ users: followingUsers, companies: followingCompanies })
  } catch (err) {
    console.error('Failed loading following', err)
    setFollowing({ users: [], companies: [] })
  } finally {
    setLoadingFollowing(false)
  }
}


  if (loading) return <LoadingSpinner text="Loading analytics & network..." />

  const totals = analytics.totals ?? {}
  const applicationStatus = analytics.applicationStatus ?? []

  const statCards = [
    { icon: Briefcase, label: 'Total Jobs Posted', value: totals.jobs || 0, change: '+12%' },
    { icon: Users, label: 'Total Applications', value: totals.applications || 0, change: '+8%' },
    { icon: Eye, label: 'Total Profile Views', value: totals.totalViews || 0, change: '+15%' },
    { icon: TrendingUp, label: 'Application Rate', value:
        (totals.applications && totals.totalViews)
          ? `${((totals.applications / totals.totalViews) * 100).toFixed(1)}%`
          : '0%', change: '+3%' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Recruitment performance & network</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((s, idx) => {
          const Icon = s.icon
          return (
            <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{s.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{s.value}</p>
                <div className="text-sm text-green-600 mt-1">{s.change} from last period</div>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Icon size={28} className="text-blue-600" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Application Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
            <div className="space-y-3">
              {applicationStatus.length === 0 && <p className="text-sm text-gray-500">No application data yet</p>}
              {applicationStatus.map((st) => (
                <div key={st._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      st._id === 'pending' ? 'bg-yellow-500' :
                      st._id === 'viewed' ? 'bg-blue-500' :
                      st._id === 'interview' ? 'bg-purple-500' :
                      st._id === 'hired' ? 'bg-green-500' :
                      'bg-red-500' }`} />
                    <span className="text-sm font-medium text-gray-700 capitalize">{st._id}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-900 font-semibold">{st.count}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(st.count / (totals.applications || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm text-gray-700">
              {analytics.recentActivity?.length ? analytics.recentActivity.map((a, i) => (
                <div key={i} className="flex justify-between">
                  <div>{a.type} — <span className="font-semibold">{a.count}</span></div>
                  <div className="text-gray-500">{a.time}</div>
                </div>
              )) : <p className="text-gray-500">No recent activity</p>}
            </div>
          </div>
        </div>

        {/* Followers / Following */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Followers</h3>
              <div className="text-sm text-gray-500">{ (followers.users.length + followers.companies.length) } total</div>
            </div>

            {loadingFollowers ? (
              <LoadingSpinner text="Loading followers..." small />
            ) : (
              <div className="space-y-3 max-h-48 overflow-auto">
                {followers.users.map(u => (
                  <div key={u._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(u.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.location || ''}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">User</div>
                  </div>
                ))}

                {followers.companies.map(c => (
                  <div key={c._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {(c.name || 'C').charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.industry || ''}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Company</div>
                  </div>
                ))}

                {followers.users.length + followers.companies.length === 0 && (
                  <div className="text-sm text-gray-500">No followers yet</div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Following</h3>
              <div className="text-sm text-gray-500">{ (following.users.length + following.companies.length) } total</div>
            </div>

            {loadingFollowing ? (
              <LoadingSpinner text="Loading following..." small />
            ) : (
              <div className="space-y-3 max-h-48 overflow-auto">
                {following.users.map(u => (
                  <div key={u._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {(u.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.location || ''}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">User</div>
                  </div>
                ))}

                {following.companies.map(c => (
                  <div key={c._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-semibold">
                        {(c.name || 'C').charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.industry || ''}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Company</div>
                  </div>
                ))}

                {following.users.length + following.companies.length === 0 && (
                  <div className="text-sm text-gray-500">Not following anyone</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyAnalytics

import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Menu, X, Briefcase, Users, Building, UserPlus } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import NotificationBell from '../common/NotificationBell.jsx'
import { userService } from '../../services/userService.js'
import Avatar from '../common/Avatar.jsx'


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isRequestsOpen, setIsRequestsOpen] = useState(false)
  const [connectionRequests, setConnectionRequests] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      loadConnectionRequests()
    }
  }, [isAuthenticated, user?._id])

  const loadConnectionRequests = async () => {
    try {
      const resp = await userService.getPendingConnectionRequests()
      setConnectionRequests(resp?.data ?? [])
    } catch (err) {
      console.error('Failed to load connection requests:', err)
    }
  }

  const respondToRequest = async (connectionId, action) => {
    try {
      await userService.respondConnectionRequest(connectionId, action)
      setConnectionRequests(prev => prev.filter(req => req._id !== connectionId))
    } catch (err) {
      console.error('Failed to respond to request:', err)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const navigation = [
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'People', href: '/people', icon: Users },
    { name: 'Posts', href: '/feeds', icon: Users },
    { name: 'Companies', href: '/companies', icon: Building },
  ]

  // Helper: return profile URL for current user based on role
  const getProfileHref = () => {
    if (!user || !user._id) return '#'
    if (user.role === 'company') {
      return `/company/profile/${user._id}`
    }
    // default candidate
    return `/user/profile/${user._id}`
  }

  // Build user menu dynamically so "Profile" points to the public profile URL
  const profileHref = getProfileHref()

  const userNavigation = user?.role === 'candidate' ? [
    { name: 'Dashboard', href: '/candidate/dashboard' },
    { name: 'Profile', href: profileHref },
    { name: 'Edit Profile', href: '/candidate/profile' },
    { name: 'Posts', href: '/candidate/feed' },
    { name: 'Applications', href: '/candidate/applications' },
    { name: 'Save Jobs', href: '/candidate/saved-jobs' },
    
  ] : user?.role === 'company' ? [
    { name: 'Dashboard', href: '/company/dashboard' },
    { name: 'Profile', href: profileHref },
    { name: 'Edit Profile', href: '/company/profile' },
    { name: 'Posts', href: '/company/feed' },
    { name: 'Job Postings', href: '/company/jobs' },

  ] : []

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Briefcase className="text-white" size={20} />
              </div>
              <span className="ml-2 text-xl font-bold gradient-text">ProConnect</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} className="mr-1" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search jobs, people, companies..."
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <NotificationBell />

                {/* Friend Requests Icon */}
                <div className="relative">
                  <button
                    onClick={() => setIsRequestsOpen(!isRequestsOpen)}
                    className="relative flex items-center p-2 rounded-full hover:bg-gray-100"
                  >
                    <UserPlus size={20} />
                    {connectionRequests.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {connectionRequests.length}
                      </span>
                    )}
                  </button>

                  {/* Requests Dropdown */}
                  {isRequestsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Connection Requests</h3>
                        {connectionRequests.length === 0 && (
                          <p className="text-xs text-gray-500">No pending requests</p>
                        )}
                        {connectionRequests.map((req) => (
                          <div key={req._id} className="flex items-center justify-between p-2 border-b border-gray-100">
                            <div className="flex items-center space-x-2">
                              <Avatar src={req.requester?.avatar} name={req.requester?.name} size="sm" />

                              <span className="text-sm text-gray-700">{req.requester?.name}</span>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => respondToRequest(req._id, 'accept')}
                                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => respondToRequest(req._id, 'reject')}
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Avatar src={user?.avatar} name={user?.name} size="sm" className="mr-0" />

                    <span className="hidden md:block text-gray-700">{user?.name}</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {userNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

import React, { useState, useEffect, useRef } from 'react' 
import { Search, UserPlus, Mail, MapPin, Briefcase, Users } from 'lucide-react'
import { userService } from '../../services/userService.js'
import { searchService } from '../../services/searchService.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { Link } from 'react-router-dom'
import Avatar from '../../components/common/Avatar.jsx'



const CandidateConnections = () => {
  const [connections, setConnections] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const debounceRef = useRef(null)
  const { user: currentUser } = useAuth() // current logged-in user

  
  // Load connections
  const loadConnections = async () => {
    try {
      const resp = await userService.getConnections()
      console.log("Connections from backend:", resp?.data ?? resp);
      const payload = resp?.data ?? resp
      let connList = []
      if (Array.isArray(payload)) connList = payload
      else if (payload?.connections && Array.isArray(payload.connections)) connList = payload.connections
      else if (payload?.data && Array.isArray(payload.data)) connList = payload.data
      setConnections(connList)
    } catch (err) {
      console.error('Failed to load connections:', err)
      setConnections([])
    }
  }

  // Load default suggestions
  const loadDefaultSuggestions = async () => {
    try {
      let resp = null
      try {
        resp = await userService.searchUsers()
      } catch (innerErr) {
        resp = null
      }
      
      const payload = resp?.data ?? resp
      let users = []
      if (Array.isArray(payload)) users = payload
      else if (payload?.users && Array.isArray(payload.users)) users = payload.users
      else if (payload?.data && Array.isArray(payload.data)) users = payload.data
      else users = []
      
      if (users.length === 0) {
        users = [
          { _id: '1', name: 'John Developer', bio: 'Senior Software Engineer', skills: ['React','Node'], location: 'San Francisco' },
          { _id: '2', name: 'Sarah Designer', bio: 'UI/UX Designer', skills: ['Figma','Sketch'], location: 'New York' }
        ]
      }

      setSuggestions(users)
    } catch (err) {
      setSuggestions([
        { _id: '1', name: 'John Developer', bio: 'Senior Software Engineer', skills: ['React','Node'], location: 'San Francisco' },
        { _id: '2', name: 'Sarah Designer', bio: 'UI/UX Designer', skills: ['Figma','Sketch'], location: 'New York' }
      ])
    }
  }

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!searchTerm || searchTerm.trim().length < 2) {
      setIsSearching(false)
      return
    }
    
    setIsSearching(true)
    debounceRef.current = setTimeout(() => doSearch(searchTerm.trim()), 300)
    
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      }
  }, [searchTerm])
  
  useEffect(() => {
    const init = async () => {
      await loadConnections()
      await loadDefaultSuggestions()
      setLoading(false)
    }
    init()
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])
  // Backend search
  const doSearch = async (query) => {
    try {
      const resp = await searchService.globalSearch(query, 'users')
      const payload = resp?.data ?? resp
      let usersList = []
      if (payload?.users && Array.isArray(payload.users)) usersList = payload.users
      else if (Array.isArray(payload)) usersList = payload
      else if (payload?.data && Array.isArray(payload.data)) usersList = payload.data

      // Compute connected IDs
      const connectedIds = new Set(
        connections
          .filter(c => c.status === 'accepted')
          .map(c => {
            if (c.requester?._id.toString() === currentUser._id) return c.recipient?._id
            return c.requester?._id
          })
          .filter(Boolean)
      )

      const filtered = usersList.filter(u => {
        const uid = u._id || u.id
        if (!uid) return false
        if (currentUser && (uid === currentUser._id || uid === currentUser.id)) return false
        return true
      })

      setSuggestions(filtered)
      setIsSearching(false)
    } catch (err) {
      console.error('Search failed:', err)
      setIsSearching(false)
    }
  }

  // Connect user
  const handleConnect = async (userId) => {
    try {
      if (!userId || !currentUser) return

      const resp = await userService.sendConnectionRequest(userId, 'User')

      // After success or already exists, remove from suggestions and reload connections
      setSuggestions(prev => prev.filter(u => (u._id || u.id) !== userId))
      await loadConnections()
    } catch (err) {
      if (err?.response?.data?.message === 'Connection already exists') {
        setSuggestions(prev => prev.filter(u => (u._id || u.id) !== userId))
        await loadConnections()
      } else {
        console.error('Failed to send connection request:', err)
      }
    }
  }

  // Compute already connected IDs from accepted connections
  const connectedIds = new Set(
    connections
      .filter(c => c.status === 'accepted')
      .map(c => {
        if (c.requester?._id.toString() === currentUser._id) return c.recipient?._id
        return c.requester?._id
      })
      .filter(Boolean)
  )

  const filteredConnections = connections.filter((connection) => {
    const other = connection.requester?._id === currentUser._id ? connection.recipient : connection.requester
    if (!other || !other.name) return false
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return other.name.toLowerCase().includes(term) || (other.bio?.toLowerCase() || '').includes(term)
  })

  if (loading) return <LoadingSpinner text="Loading your connections..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Network</h1>
          <p className="text-gray-600 mt-2">Connect with professionals and grow your network</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search connections (type at least 2 characters)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        {isSearching && <p className="mt-2 text-sm text-gray-500">Searching...</p>}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Connections list */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Connections ({connections.filter(c => c.status === 'accepted').length})</h2>

          <div className="space-y-4">
            {filteredConnections.map((connection) => {
              const otherUser = connection.requester?._id === currentUser._id ? connection.recipient : connection.requester
              return (
                <div key={connection._id || otherUser._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar user={otherUser} size={48} />

                      <div>
                        <Link 
  to={`/user/profile/${otherUser._id}`} 
  className="font-semibold text-gray-900 hover:underline"
>
  {otherUser.name}
</Link>
<p className="text-sm text-gray-600">{otherUser.bio}</p>

                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          {otherUser.location && (<span className="flex items-center"><MapPin size={12} className="mr-1" />{otherUser.location}</span>)}
                          {otherUser.skills && otherUser.skills.length > 0 && (<span className="flex items-center"><Briefcase size={12} className="mr-1" />{otherUser.skills.slice(0,2).join(', ')}</span>)}
                        </div>
                      </div>
                    </div>
                    <Link to={'/messages'} className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      <Mail size={16} className="mr-2" />
                      Message
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredConnections.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No connections found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {connections.length === 0 ? "You haven't made any connections yet." : "Try adjusting your search criteria."}
              </p>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">People You May Know</h2>
          <div className="space-y-4">
            {suggestions.length === 0 && !isSearching && <div className="text-sm text-gray-500">No suggestions found.</div>}
            {suggestions.map((u) => {
              const uid = u._id || u.id
              const alreadyConnected = connectedIds.has(uid)
              return (
                <div key={uid} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center space-x-3 mb-3">
                   <Avatar user={u} size={40} />
                    <div>
                      <Link 
  to={`/user/profile/${uid}`} 
  className="font-semibold text-sm hover:underline"
>
  {u.name}
</Link>
<p className="text-xs text-gray-600 truncate">{u.bio}</p>

                    </div>
                  </div>
                  <button
                    onClick={() => !alreadyConnected && handleConnect(uid)}
                    disabled={alreadyConnected}
                    className={`w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm ${
                      alreadyConnected ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <UserPlus size={14} className="mr-1" />
                    {alreadyConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateConnections

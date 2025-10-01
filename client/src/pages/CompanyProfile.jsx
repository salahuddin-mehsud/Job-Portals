import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Building, Users, UserPlus, UserCheck, Globe } from 'lucide-react'
import { profileService } from '../services/profileService.js'
import { companyService } from '../services/companyService.js'
import { useAuth } from '../hooks/useAuth.js'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import PostCard from '../components/common/PostCard.jsx'
import toast from 'react-hot-toast'
import Avatar from '../components/common/Avatar.jsx'

const CompanyProfilePublic = () => {
  const { companyId } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [companyId])

  const loadProfile = async () => {
    try {
      const response = await profileService.getCompanyProfile(companyId)
      if (response.success) {
        setProfile(response.data.profile)
        setPosts(response.data.posts)
        setIsFollowing(response.data.isFollowing)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('Please login to follow companies')
      return
    }

    setFollowLoading(true)
    try {
      if (isFollowing) {
        await companyService.unfollowCompany(companyId)
        setIsFollowing(false)
        toast.success('Unfollowed company')
      } else {
        await companyService.followCompany(companyId)
        setIsFollowing(true)
        toast.success('Following company')
      }
    } catch (error) {
      console.error('Failed to follow company:', error)
      toast.error('Failed to follow company')
    } finally {
      setFollowLoading(false)
    }
  }

  const handlePostUpdate = () => {
    loadProfile()
  }

  if (loading) {
    return <LoadingSpinner text="Loading company profile..." />
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Company not found</h1>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser && currentUser._id === profile._id
  const allFollowers = [
    ...(profile.followersUsers || []),
    ...(profile.followersCompanies || [])
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
           <Avatar src={profile.logo || profile.avatar} name={profile.name} size="lg" />


            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600 mt-1">{profile.industry}</p>
              <p className="text-gray-600">{profile.bio || 'No description yet'}</p>
              
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                {profile.location && (
                  <span className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {profile.location}
                  </span>
                )}
                {profile.size && (
                  <span className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {profile.size} employees
                  </span>
                )}
                {profile.founded && (
                  <span className="flex items-center">
                    <Building size={14} className="mr-1" />
                    Founded {profile.founded}
                  </span>
                )}
                {profile.website && (
                  <span className="flex items-center">
                    <Globe size={14} className="mr-1" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Website
                    </a>
                  </span>
                )}
              </div>

              <div className="flex space-x-6 mt-4">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{posts.length}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{allFollowers.length}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {(profile.followingUsers?.length || 0) + (profile.followingCompanies?.length || 0)}
                  </div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>
            </div>
          </div>

          {!isOwnProfile && currentUser && (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isFollowing 
                  ? 'bg-gray-300 text-gray-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck size={16} className="mr-2" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus size={16} className="mr-2" />
                  Follow
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Posts */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Company Updates</h2>
          
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                onUpdate={handlePostUpdate}
                showDelete={isOwnProfile}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                {isOwnProfile ? 'Start sharing company updates and news.' : 'This company hasn\'t posted anything yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Followers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Followers</h3>
            <div className="space-y-3">
              {allFollowers.length > 0 ? (
                allFollowers.slice(0, 6).map(follower => (
                  <Link
                    key={follower._id}
                    to={follower.role === 'company' ? 
                      `/company/profile/${follower._id}` : 
                      `/user/profile/${follower._id}`
                    }
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <Avatar src={follower.avatar || follower.logo} name={follower.name} size="sm" />

                    <div>
                      <p className="text-sm font-medium text-gray-900">{follower.name}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {follower.role === 'company' ? 'Company' : follower.role}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500">No followers yet</p>
              )}
            </div>
          </div>

          {/* Following Users */}
          {profile.followingUsers && profile.followingUsers.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Following Users</h3>
              <div className="space-y-3">
                {profile.followingUsers.slice(0, 6).map(user => (
                  <Link
                    key={user._id}
                    to={`/user/profile/${user._id}`}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                   <Avatar src={user.avatar} name={user.name} size="sm" />

                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Following Companies */}
          {profile.followingCompanies && profile.followingCompanies.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Following Companies</h3>
              <div className="space-y-3">
                {profile.followingCompanies.slice(0, 6).map(company => (
                  <Link
                    key={company._id}
                    to={`/company/profile/${company._id}`}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                   <Avatar src={company.logo} name={company.name} size="sm" />


                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{company.name}</p>
                      <p className="text-xs text-gray-500">{company.industry}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyProfilePublic
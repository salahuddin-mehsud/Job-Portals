import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import FollowButton from '../components/FollowButton';
import Chat from '../components/Chat';

const PublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/public/${id}`);
        const profileData = response.data;
        
        // Ensure company followers are properly handled
        if (profileData.role === 'company' && profileData.companyProfile && 
            profileData.companyProfile.followers) {
          // The followers should now be populated with user data
          setProfile(profileData);
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching public profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Profile Not Found</h2>
          <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isCompany = profile.role === 'company';
  const displayName = isCompany ? profile.companyProfile.name : profile.fullName;
  const displayTitle = isCompany ? profile.companyProfile.industry : profile.professionalTitle;
  const profileImage = isCompany 
    ? profile.companyProfile.logoUrl 
    : profile.profilePicture || 'https://randomuser.me/api/portraits/men/32.jpg';
  
  // Get the correct followers for company vs user
  const followers = isCompany 
    ? (profile.companyProfile.followers || [])
    : (profile.followers || []);

  // Get the correct following for company vs user
  const followingUsers = isCompany ? [] : (profile.followingUsers || []);
  const followingCompanies = isCompany ? [] : (profile.followingCompanies || []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                src={profileImage} 
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{displayName}</h1>
              <p className="text-gray-600 text-lg">{displayTitle}</p>
              
              {isCompany && profile.companyProfile.headquarters && (
                <p className="text-gray-500 flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profile.companyProfile.headquarters}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="text-center">
                  <div className="font-bold text-xl">{followers.length}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                
                {!isCompany && (
                  <div className="text-center">
                    <div className="font-bold text-xl">
                      {followingUsers.length + followingCompanies.length}
                    </div>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="self-end flex space-x-2">
              <FollowButton targetId={profile._id} targetType={profile.role} />
              
              {/* Add Chat Button */}
              <button
                onClick={() => setShowChat(!showChat)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                Message
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'followers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('followers')}
            >
              Followers ({followers.length})
            </button>
            
            {!isCompany && (
              <button
                className={`px-6 py-3 font-medium ${activeTab === 'following' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('following')}
              >
                Following ({followingUsers.length + followingCompanies.length})
              </button>
            )}
            
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'about' && (
              <div>
                {isCompany ? (
                  <>
                    <h3 className="text-xl font-semibold mb-4">Company Overview</h3>
                    {profile.companyProfile.description && (
                      <p className="text-gray-700 mb-6">{profile.companyProfile.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {profile.companyProfile.website && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Website</h4>
                          <a 
                            href={profile.companyProfile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {profile.companyProfile.website}
                          </a>
                        </div>
                      )}
                      
                      {profile.companyProfile.foundingYear && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Founded</h4>
                          <p className="text-gray-700">{profile.companyProfile.foundingYear}</p>
                        </div>
                      )}
                      
                      {profile.companyProfile.size && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Company Size</h4>
                          <p className="text-gray-700">{profile.companyProfile.size} employees</p>
                        </div>
                      )}
                      
                      {profile.companyProfile.industry && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Industry</h4>
                          <p className="text-gray-700">{profile.companyProfile.industry}</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-4">About</h3>
                    {profile.professionalTitle && (
                      <p className="text-gray-700 mb-4">{profile.professionalTitle}</p>
                    )}
                    
                    {profile.education && profile.education.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">Education</h4>
                        {profile.education.map((edu, index) => (
                          <div key={index} className="mb-4">
                            <p className="font-medium">{edu.school}</p>
                            <p className="text-gray-600">{edu.degree} in {edu.fieldOfStudy}</p>
                            <p className="text-gray-500 text-sm">
                              {edu.startYear} - {edu.endYear || 'Present'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill, index) => (
                            <span 
                              key={index}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {profile.certificates && profile.certificates.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Certifications</h4>
                        {profile.certificates.map((cert, index) => (
                          <div key={index} className="mb-4">
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-gray-600">Issued by {cert.issuedBy}</p>
                            <p className="text-gray-500 text-sm">
                              {new Date(cert.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            
            {activeTab === 'followers' && (
              <div>
                <h4 className="text-lg font-medium mb-4">Followers ({followers.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followers.length > 0 ? (
                    followers.map(follower => (
                      <Link
                        key={follower._id}
                        to={`/profile/${follower._id}`}
                        className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <img 
                          src={follower.profilePicture || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                          alt={follower.fullName || 'Follower'}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{follower.fullName || 'Unknown User'}</p>
                          <p className="text-sm text-gray-600">{follower.professionalTitle || ''}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500">No followers yet</p>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'following' && !isCompany && (
              <div>
                <h4 className="text-lg font-medium mb-4">
                  Following ({followingUsers.length + followingCompanies.length})
                </h4>
                
                <h5 className="font-medium mb-3">People</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {followingUsers.length > 0 ? (
                    followingUsers.map(user => (
                      <Link
                        key={user._id}
                        to={`/profile/${user._id}`}
                        className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <img 
                          src={user.profilePicture || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-gray-600">{user.professionalTitle}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500">Not following any users yet</p>
                  )}
                </div>
                
                <h5 className="font-medium mb-3">Companies</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {followingCompanies.length > 0 ? (
                    followingCompanies.map(company => (
                      <Link
                        key={company._id}
                        to={`/profile/${company._id}`}
                        className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3"
                      >
                        <img 
                          src={company.companyProfile?.logoUrl || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                          alt={company.companyProfile?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{company.companyProfile?.name}</p>
                          <p className="text-sm text-gray-600">{company.companyProfile?.industry}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500">Not following any companies yet</p>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'activity' && (
              <div>
                <h4 className="text-lg font-medium mb-4">Recent Activity</h4>
                <p className="text-gray-500">No recent activity to show</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render Chat Component */}
      {showChat && (
        <Chat 
          receiver={profile} 
          onClose={() => setShowChat(false)} 
        />
      )}
    </div>
  );
};

export default PublicProfile;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FollowButton = ({ targetId, targetType }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/follow/follow-status/${targetId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };
    
    if (token) {
      checkFollowStatus();
    }
  }, [targetId, token]);

  const handleFollow = async () => {
    if (!token) {
      alert('Please login to follow');
      return;
    }
    
    setIsLoading(true);
    try {
      if (isFollowing) {
        await axios.post(
          `http://localhost:5000/api/follow/unfollow/${targetId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setIsFollowing(false);
      } else {
        await axios.post(
          `http://localhost:5000/api/follow/follow/${targetId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Error updating follow status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md font-medium ${
        isFollowing
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } transition-colors`}
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
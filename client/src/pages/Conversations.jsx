import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No conversations yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {conversations.map((conversation) => (
            <Link
              key={conversation._id}
              to={`/profile/${conversation._id}`}
              className="flex items-center p-4 border-b hover:bg-gray-50 transition-colors"
            >
              <img
                src={conversation.profilePicture || 'https://randomuser.me/api/portraits/men/32.jpg'}
                alt={conversation.fullName}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{conversation.fullName}</h3>
                  <span className="text-sm text-gray-500">
                    {formatTime(conversation.timestamp)}
                  </span>
                </div>
                <p className="text-gray-600 truncate">{conversation.lastMessage}</p>
              </div>
              {conversation.unreadCount > 0 && (
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs ml-2">
                  {conversation.unreadCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Conversations;
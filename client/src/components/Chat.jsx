import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';

const Chat = ({ receiver, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState(null); // Added user state
  const socket = useSocket();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    if (receiver) {
      fetchMessages();
    }
  }, [receiver]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', handleReceiveMessage);
      socket.on('typingStart', handleTypingStart);
      socket.on('typingStop', handleTypingStop);
    }

    return () => {
      if (socket) {
        socket.off('receiveMessage', handleReceiveMessage);
        socket.off('typingStart', handleTypingStart);
        socket.off('typingStop', handleTypingStop);
      }
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/messages/conversation/${receiver._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
      
      // Mark messages as read
      await axios.put(`/api/messages/markAsRead/${receiver._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleReceiveMessage = (message) => {
    setMessages(prev => [...prev, message]);
    
    // If message is from current receiver, mark as read
    if (message.sender._id === receiver._id) {
      if (socket) {
        socket.emit('markAsRead', { 
          messageId: message._id, 
          userId: message.receiver._id 
        });
      }
    }
  };

  const handleTypingStart = (data) => {
    if (data.senderId === receiver._id) {
      setIsTyping(true);
    }
  };

  const handleTypingStop = (data) => {
    if (data.senderId === receiver._id) {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && user) { // Added user check
      const messageData = {
        senderId: user._id,
        receiverId: receiver._id,
        content: newMessage.trim()
      };
      
      socket.emit('sendMessage', messageData);
      setNewMessage('');
      
      // Stop typing indicator
      socket.emit('typingStop', {
        senderId: user._id,
        receiverId: receiver._id
      });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    if (socket && user) { // Added user check
      // Start typing indicator
      socket.emit('typingStart', {
        senderId: user._id,
        receiverId: receiver._id
      });
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typingStop', {
          senderId: user._id,
          receiverId: receiver._id
        });
      }, 1000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
      {/* Chat Header */}
      <div className="flex justify-between items-center p-4 bg-primary text-white rounded-t-lg">
        <div className="flex items-center">
          <img 
            src={receiver.profilePicture || 'https://randomuser.me/api/portraits/men/32.jpg'} 
            alt={receiver.fullName} 
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <h3 className="font-semibold">{receiver.fullName}</h3>
            {isTyping && (
              <p className="text-xs">typing...</p>
            )}
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200">
         Chat
        </button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-4 ${message.sender._id === user._id ? 'text-right' : ''}`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${message.sender._id === user._id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 rounded-r-lg hover:bg-primary-dark transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
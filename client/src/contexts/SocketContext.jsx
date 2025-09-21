import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Use the correct API URL
        const API_URL = 'http://localhost:5000';
        const newSocket = io(API_URL);
        
        // Join user's room
        newSocket.emit('join', user._id);
        
        setSocket(newSocket);

        return () => newSocket.close();
      } catch (error) {
        console.error('Error parsing user data for socket connection:', error);
      }
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
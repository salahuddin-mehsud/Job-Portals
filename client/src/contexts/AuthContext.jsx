import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token) {
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }

      // Verify token with both endpoints (fallback)
      axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      })
      .catch(() => {
        // Try the other endpoint if first fails
        axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        })
        .catch(error => {
          console.error('Token validation failed:', error);
          logout();
        });
      });
    }

    setLoading(false);
  }, []);

  // Supports both (token, userData) and (userData, token) formats
  const login = (arg1, arg2) => {
    let token, userData;
    if (typeof arg1 === 'string') {
      token = arg1;
      userData = arg2;
    } else {
      userData = arg1;
      token = arg2;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

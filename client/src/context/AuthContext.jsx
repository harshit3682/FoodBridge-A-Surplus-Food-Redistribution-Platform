import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  });

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/me', {
        timeout: 5000 // 5 second timeout
      });
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // Clear invalid token and logout
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      } else if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        // Network error or timeout - clear token and show login
        console.warn('Backend connection failed, clearing auth state');
        logout();
      } else {
        // Other errors - just clear loading
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Fetch user on mount if token exists
  useEffect(() => {
    if (token && token.trim() !== '') {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


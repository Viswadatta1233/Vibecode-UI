import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';
import type { User, LoginCredentials, SignupCredentials } from '../types';
import { setAuthToken } from '../services/api';
import toast from 'react-hot-toast';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Fetch user details if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        setAuthToken(token);
        try {
          // Try to fetch user details from backend
          const res = await axios.get('https://43.204.79.92/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (err) {
          setUser(null);
          setToken(null);
          setAuthToken('');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login(credentials);
      setToken(response.token);
      setAuthToken(response.token);
      localStorage.setItem('token', response.token);
      toast.success('Login successful!');
      // Fetch user info after login
      const res = await axios.get('https://43.204.79.92/api/auth/me', {
        headers: { Authorization: `Bearer ${response.token}` },
      });
      setUser(res.data);
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      const response = await authAPI.signup(credentials);
      setToken(response.token);
      setAuthToken(response.token);
      localStorage.setItem('token', response.token);
      toast.success('Account created successfully!');
      // Fetch user info after signup
      const res = await axios.get('https://43.204.79.92/api/auth/me', {
        headers: { Authorization: `Bearer ${response.token}` },
      });
      setUser(res.data);
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken('');
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
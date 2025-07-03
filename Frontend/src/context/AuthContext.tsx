import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth-token');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          if (response.data.success) {
            setAuthState({ 
              user: response.data.user, 
              isAuthenticated: true 
            });
          }
        } catch (error) {
          localStorage.removeItem('auth-token');
          localStorage.removeItem('pos-user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        localStorage.setItem('auth-token', token);
        localStorage.setItem('pos-user', JSON.stringify(user));
        
        setAuthState({ user, isAuthenticated: true });
        return true;
      }
      
      return false;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({ user: null, isAuthenticated: false });
      localStorage.removeItem('auth-token');
      localStorage.removeItem('pos-user');
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
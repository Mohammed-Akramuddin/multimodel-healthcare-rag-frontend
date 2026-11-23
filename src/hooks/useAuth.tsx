import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

export interface User {
  id: number;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'patient';
  full_name: string;
  is_active?: boolean;
  patient_profile_id?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  register: (full_name: string, email: string, role: string, password: string) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  isMedicalStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('healthcare_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('healthcare_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await api.get('/api/auth/me');
          if (res?.data) {
            setUser(res.data);
            localStorage.setItem('healthcare_user', JSON.stringify(res.data));
          }
        } catch (err) {
          // If token is a valid demo token and we already have cached user, preserve it
          const saved = localStorage.getItem('healthcare_user');
          if (saved && (token.startsWith('demo_') || token.startsWith('sb_'))) {
            try {
              setUser(JSON.parse(saved));
            } catch {
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setIsLoading(false);
    };
    fetchMe();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('healthcare_token', newToken);
    localStorage.setItem('healthcare_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (full_name: string, email: string, role: string, password: string) => {
    const res = await api.post('/api/auth/register', { full_name, email, role, password });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('healthcare_token');
    localStorage.removeItem('healthcare_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isMedicalStaff = user?.role === 'doctor' || user?.role === 'nurse' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading, isAdmin, isMedicalStaff }}>
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


import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance, { setAccessToken } from '../utils/axiosInstance';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/token/refresh');
        setUser(response.data.user);
        setAccessToken(response.data.accessToken);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/auth/signin', { email, password });
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Ошибка входа');
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/api/auth/signup', { username, email, password });
      setUser(response.data.user);
      setAccessToken(response.data.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error('Ошибка регистрации');
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.get('/api/auth/logout');
      setAccessToken('');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      throw new Error('Ошибка выхода');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
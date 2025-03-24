import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { AuthState } from '../types/auth';

interface AuthContextType {
  authState: AuthState;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  connectWallet: (address: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authState: { isAuthenticated: false, user: null, loading: true },
  login: async () => {},
  logout: async () => {},
  connectWallet: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const login = useCallback(() => {
    // 直接重定向到 Google OAuth 登录页面
    const googleAuthUrl = `${process.env.REACT_APP_API_URL}/api/auth/google/authorize`;
    window.location.href = googleAuthUrl;
  }, []);

  const logout = useCallback(async () => {
    await axios.post('/api/auth/logout');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  }, []);

  const connectWallet = useCallback(async (address: string) => {
    const response = await axios.post('/api/wallet/connect', { address });
    setAuthState(prev => ({
      ...prev,
      user: response.data,
    }));
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout, connectWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

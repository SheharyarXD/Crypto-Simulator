import React, { createContext, useState, useContext, ReactNode } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  userId: number | null;
  login: (userId: number) => void;  // Accept userId when logging in
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);  // Store userId

  const login = (id: number) => {
    setIsAuthenticated(true);
    setUserId(id);  // Store userId when logging in
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);  // Clear userId when logging out
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

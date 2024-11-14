import React, { createContext, useState, useContext } from 'react';

// Create Context
const AuthContext = createContext();

// Provide Auth Context to the app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

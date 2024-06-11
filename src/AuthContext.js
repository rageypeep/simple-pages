import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLoggedIn(true);
        setUserRole(decoded.role);
      } catch (error) {
        console.error('Error decoding token', error);
        setLoggedIn(false);
        setUserRole('');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

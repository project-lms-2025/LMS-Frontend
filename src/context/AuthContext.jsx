import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export const AuthContext = createContext({
  role: null,
  authToken: null,
  initialized: false,
  login: () => {},
  logout: () => {},
  isLoggedIn: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken"));
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // make sure we sync once, immediately
    setRole(localStorage.getItem("role"));
    setAuthToken(localStorage.getItem("authToken"));
    setInitialized(true);
  }, []);

  const login = (userRole, token) => {
    localStorage.setItem("role", userRole);
    localStorage.setItem("authToken", token);
    setRole(userRole);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("authToken");
    setRole(null);
    setAuthToken(null);
  };

  const isLoggedIn = () => Boolean(authToken);

  const value = useMemo(
    () => ({ role, authToken, initialized, login, logout, isLoggedIn }),
    [role, authToken, initialized]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

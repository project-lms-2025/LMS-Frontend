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
  const [email, setEmail] = useState(() => localStorage.getItem("email"));
  const [device_type, setDeviceType] = useState(() => localStorage.getItem("device_type"));
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // make sure we sync once, immediately
    setRole(localStorage.getItem("role"));
    setAuthToken(localStorage.getItem("authToken"));
    setEmail(localStorage.getItem("email"));
    setDeviceType(localStorage.getItem("device_type"));
    setInitialized(true);
  }, []);

  const login = (userRole, token, email, device_type) => {
    localStorage.setItem("role", userRole);
    localStorage.setItem("authToken", token);
    localStorage.setItem("email", email);
    localStorage.setItem("device_type", device_type);
    setRole(userRole);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    localStorage.removeItem("device_type");
    setRole(null);
    setAuthToken(null);
    setEmail(null);
    setDeviceType(null);
  };

  const isLoggedIn = () => Boolean(authToken);

  const value = useMemo(
    () => ({ role, authToken, initialized, login, logout, isLoggedIn }),
    [role, authToken, initialized]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

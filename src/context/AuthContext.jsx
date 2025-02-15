import { createContext, useContext, useState, useEffect } from "react";

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [email, setEmail] = useState(() => localStorage.getItem("email"));

  // Sync role and email when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
      setEmail(localStorage.getItem("email"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Login function
  const login = (userRole ) => {
    localStorage.setItem("role", userRole);
    setRole(userRole);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("authToken");
    setRole(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ role, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

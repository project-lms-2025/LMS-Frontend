import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { GraduationCap, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getUserProfile } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { role, authToken, logout, initialized } = useAuth(); // Use AuthContext for reactive updates
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    if (!authToken) return;
    setLoadingProfile(true);
    getUserProfile()
      .then((res) => setUser(res.data))
      .catch(console.error)
      .finally(() => setLoadingProfile(false));
  }, [authToken]);

  const handleLogout = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) throw new Error("No user email found");
      await logoutUser(email); // Call logout API
      logout(); // Update AuthContext state
      navigate("/signin"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = {
    teacher: [
      { name: "Home", href: "/" },
      { name: "Dashboard", href: "/teacherDashboard" },
    ],
    student: [
      // { name: "Home", href: "/" },
      // { name: "Dashboard", href: "/studentClass" },
    ],
    admin: [
      { name: "Home", href: "/" },
      { name: "New Registration", href: "/teacherRegister" },
    ],
  };
  if (!initialized) return null;
  return (
    <header className="sticky z-50 -b lg:px-16 pt-4    bg-none dark:bg-primary-purple">
      <div className="container mx-auto px-4 bg-white rounded-xl border border-b-4 border-r-4 border-slate-600 dark:bg-primary-purple/20 dark:border-accent-yellow/20 shadow-lg">
        <div className="flex mx-4 items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-primary-purple dark:text-accent-yellow" />
            <a href="/" className="no-underline hover:no-underline">
              <span className="text-xl font-bold hover: text-primary-purple dark:text-primary-white">
                TeacherTech
              </span>
            </a>
          </div>

          {/* Navigation Links - Hidden if role is null */}
          {role && (
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks[role]?.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="dark:text-secondary-gray  hover:text-primary-purple dark:text-primary-white/80 dark:hover:text-accent-yellow transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          )}

          {/* Theme Toggle & Logout Button */}
          <div className="flex items-center space-x-4">
            {/* Show user name if logged in */}
            {user && !loading && (
              <span className="text-black dark:text-white">{user.name || user.email}</span>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary-gray/20 dark:hover:bg-primary-purple/30 border border-secondary-gray/120 dark:border-primary-white/20 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-primary-purple dark:text-accent-yellow" />
              ) : (
                <Moon className="w-5 h-5 text-primary-purple dark:text-accent-yellow" />
              )}
            </button>

            {/* Conditionally render Login / Logout button */}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 bg-primary-purple dark:bg-white dark:text-primary-purple text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

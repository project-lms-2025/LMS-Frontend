import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { GraduationCap, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser, getUserProfile } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { role, email, logout } = useAuth(); // Use AuthContext for reactive updates
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(); // Fetch user data
        // console.log(userProfile.data);
        setUser(userProfile.data); // Set user profile data
        setLoading(false); // Stop loading once data is fetched
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setLoading(false); // Stop loading if there's an error
      }
    };

    fetchUserProfile(); // Call the function to fetch user data
  }, []);

  const handleLogout = async () => {
    try {
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
      { name: "Home", href: "/" },
      { name: "Batch", href: "/batches" },
    ],
    admin: [
      { name: "Home", href: "/" },
      { name: "New Registration", href: "/teacherRegister" },
    ],
  };

  return (
    <header className="sticky top-0 z-50 border-b lg:px-16 dark:border-primary-purple/20 bg-primary-white dark:bg-primary-purple">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
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
                  className="dark:text-secondary-gray hover:text-primary-purple dark:text-primary-white/80 dark:hover:text-accent-yellow transition-colors"
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
              <span className="text-primary-white">{user.name || user.email}</span>
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

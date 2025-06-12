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
    <header className="flex justify-center z-50  px-4  ">
      <div className="container absolute top-4  lg:mx-auto  px-1 bg-white rounded-full  shadow-lg">
        <div className="flex mx-4 items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-primary-purple " />
            <a href="/" className="no-underline hover:no-underline">
              <span className="text-xl font-bold hover: text-primary-purple ">
                TeacherTech
              </span>
            </a>
          </div>
          <div className="flex gap-8  ">
            <a
              href="https://www.teachertech.in/#product"
              className="hidden md:block  text-primary-purple  hover:text-primary-purple/50  dark:hover:text-accent-yellow transition-colors"
            >
              Product & Services
            </a>
            <a
              href="/pricing"
              className="hidden md:block  text-primary-purple  hover:text-primary-purple/50  dark:hover:text-accent-yellow transition-colors"
            >
              Pricing
            </a>
            <a
              href="https://www.teachertech.in/#contact"
              className="hidden md:block  text-primary-purple  hover:text-primary-purple/50  dark:hover:text-accent-yellow transition-colors"
            >
              Contact Us
            </a>

          {/* Navigation Links - Hidden if role is null */}
          {/* {role && (
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks[role]?.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="dark:text-black text-primary-purple   hover:text-primary-purple/50 dark:text-primary-white/80 dark:hover:text-accent-yellow transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          )} */}
          </div>

          {/* Theme Toggle & Logout Button */}
          <div className="flex items-center space-x-4">
            {/* Show user name if logged in */}
            {user && !loading && (
              <span className="text-black dark:text-white">
                {user.name || user.email}
              </span>
            )}

            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary-gray/20 dark:hover:bg-primary-purple/30 border border-secondary-gray/120 dark:border-primary-white/20 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-primary-purple dark:text-accent-yellow" />
              ) : (
                <Moon className="w-5 h-5 text-primary-purple dark:text-accent-yellow" />
              )}
            </button> */}

            <a href="#contact" className="px-4 py-2 font-medium border bg-primary-purple  dark:text-white text-white rounded-full hover:bg-primary-purple/50 transition-colors">
              Get In Touch
            </a>
            {/* Conditionally render Login / Logout button */}
            {/* {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 bg-primary-purple dark:bg-white dark:text-primary-purple text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            )} */}
          </div>
        </div>
      </div>
    </header>
  );
};

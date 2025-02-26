import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { GraduationCap, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { role, email, logout } = useAuth(); // Use AuthContext for reactive updates
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

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
      { name: "Profile", href: "/teacherProfile" },
      { name: "Dashboard", href: "/teacherDashboard" },
      { name: "Classes", href: "/classes" },
      { name: "Students", href: "/teacherStudents" },
      { name: "Create Exam", href: "/quiz" },
    ],
    student: [
      { name: "Profile", href: "/studentProfile" },
      { name: "Test", href: "/studentTest" },
      { name: "Classes", href: "/studentClass" },
    ],
    admin: [
      { name: "Students", href: "/adminStudents" },
      { name: "Teacher", href: "/adminTeacher" },
      { name: "New Registration", href: "/teacherRegister" },
    ],
  };

  return (
    <header className="sticky top-0 z-50 border-b px-16 dark:border-primary-purple/20 bg-primary-white dark:bg-primary-purple">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-primary-purple dark:text-accent-yellow" />
            <a href="/">
              <span className="text-xl font-bold dark:text-primary-white">
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

            {/* Logout Button (Hidden if email is null) */}
            {email && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/90 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

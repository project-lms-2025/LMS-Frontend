import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { GraduationCap, Moon, Sun } from "lucide-react";

export const Navbar = ({ role }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navLinks = {
    Teacher: [
      { name: "Profile", href: "/teacherProfile" },
      { name: "Dashboard", href: "/teacherDashboard" },
      { name: "Students", href: "/teacherStudents" },
    ],
    Student: [
      { name: "Profile", href: "/studentProfile" },
      { name: "Test", href: "/studentTest" },
      { name: "Class", href: "/studentClass" },
    ],
    Admin: [
      { name: "Students", href: "/adminStudents" },
      { name: "Teacher", href: "/adminTeacher" },
      { name: "New Registration", href: "/adminRegister" },
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
                EduLearn
              </span>
            </a>
          </div>

          {/* Navigation Links */}
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

          {/* Theme Toggle Button */}
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
          </div>
        </div>
      </div>
    </header>
  );
};

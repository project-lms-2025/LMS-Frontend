import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Hospital, ClipboardList, BarChart3, FilePlus, FileText,
  Users, Repeat, UserRoundPlus, User, ChevronLeft
} from 'lucide-react';
import { logoutUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [role] = useState(() => localStorage.getItem("role") || "teacher");
  const { logout } = useAuth();
  const sidebarMenus = {
    admin: [
      { title: "Dashboard", icon: <LayoutDashboard size={24} />, url: "govt/dashboard" },
      { title: "Roles & Permissions", icon: <Hospital size={24} />, url: "govt/hospitals/details" },
      { title: "Alerts and Notifications", icon: <ClipboardList size={24} />, url: "govt/patient-log" },
      { title: "Create Plans and offers", icon: <BarChart3 size={24} />, url: "govt/analytics" },
      { title: "Payment Status", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
      { title: "Create Test series", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
      { title: "Pending Student status", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
      { title: "Newly Registered Students", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
      { title: "Teachers", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
      { title: "Batch Status", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
      // { title: "Groups and Communities", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
      // { title: "Posts and Announcements", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
    ],
    teacher: [
      { title: "Dashboard", icon: <LayoutDashboard size={24} />, url: "teacherDashboard" },
      { title: "Batches", icon: <Users size={24} />, url: "TBatches" },
      { title: "Courses", icon: <Repeat size={24} />, url: "courses/:batchId" },
      { title: "Classes", icon: <UserRoundPlus size={24} />, url: "classes" },
      { title: "Test", icon: <UserRoundPlus size={24} />, url: "testList" },
      { title: "Test Series", icon: <Users size={24} />, url: "testSeries" },
      { title: "Enrolled Students", icon: <UserRoundPlus size={24} />, url: "enrolledStudent" },
      // { title: "Student Performance", icon: <LayoutDashboard size={24} />, url: "not" },
      // { title: "My Schedule", icon: <FileText size={24} />, url: "not" },
      // { title: "Notes", icon: <UserRoundPlus size={24} />, url: "not" },
      // { title: "Batch Status", icon: <UserRoundPlus size={24} />, url: "not" },
      // { title: "Groups and Communities", icon: <FilePlus size={24} />, url: "not" },
      // { title: "Posts and Announcements", icon: <FilePlus size={24} />, url: "not" },
    ],
    student: [
      { title: "Batches", icon: <Repeat size={24} />, url: "batches" },
      { title: "Test Series", icon: <Users size={24} />, url: "enrolledTestSeries" },
      { title: "Tests", icon: <User size={24} />, url: "studentTestList" },
      { title: "Leaderboard", icon: <User size={24} />, url: "rank" },
      { title: "Grades & Results", icon: <User size={24} />, url: "resultList" },
      { title: "Courses", icon: <User size={24} />, url: "courses" },
      { title: "Announcements", icon: <FileText size={24} />, url: "not" },
      { title: "Planner/Schedule", icon: <LayoutDashboard size={24} />, url: "not" },
      { title: "Notes", icon: <User size={24} />, url: "not" },
      { title: "My Performance", icon: <User size={24} />, url: "not" },
    ],
  };

  const menus = sidebarMenus[role] || sidebarMenus.teacher;

  const handleNavigation = (path, index) => {
    setActiveIndex(index);
    navigate(`/${path}`);
  };

  useEffect(() => {
    const savedState = localStorage.getItem("sidebar");
    if (savedState !== null) {
      setOpen(JSON.parse(savedState));
    }
  }, [setOpen]);

  useEffect(() => {
    localStorage.setItem("sidebar", JSON.stringify(open));
  }, [open]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const email = localStorage.getItem("email");
      if (!email) throw new Error("No user email found");
      await logoutUser(email);
      logout();
      // Add a small delay to show the loading animation
      setTimeout(() => {
        navigate("/signin");
      }, 500);
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className={`${open ? "md:w-64" : "w-20"} border-r-[1px] mt-10 h-screen bg-white dark:bg-primary-purple p-5 pt-2 fixed duration-300 bg-dark-purple/90 backdrop-blur-sm`}>
      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`absolute cursor-pointer -right-3 top-6 w-7 border bg-white border-primary-purple rounded-full ${!open && "rotate-180"}`}
      >
        <ChevronLeft className="text-primary-purple" />
      </button>
      <ul className="pt-2">
        {menus.map((Menu, index) => {
          // Special handling for Courses menu item to match both /courses and /courses/:batchId
          const isActive = Menu.url === 'courses/:batchId' 
            ? location.pathname.startsWith('/courses')
            : location.pathname.startsWith(`/${Menu.url}`);
          return (
            <li
              key={index}
              className={`flex rounded-md py-2 px-2 mb-2 cursor-pointer hover:bg-primary-purple/50 text-primary-white dark:text-primary-purple text-md items-center gap-x-4 ${isActive && "bg-primary-purple dark:bg-white text-primary-purple"}`}
              onClick={() => handleNavigation(Menu.url, index)}
            >
              <div className={isActive ? "dark:text-primary-purple" : "text-primary-purple dark:text-white"}>
                {Menu.icon}
              </div>
              <span
                className={`${!open && "hidden"}  hover:font-bold hover:text-primary-purple duration-200 ${
                  isActive ? "text-white dark:text-primary-purple" : "text-primary-purple dark:text-white"
                }`}
              >
                {Menu.title}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="absolute bottom-28 left-0 w-full px-5">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center justify-center gap-2 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors ${!open && "p-2"} ${isLoggingOut ? 'opacity-75' : ''}`}
        >
          {isLoggingOut ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {open && 'Logging out...'}
            </>
          ) : open ? (
            'Logout'
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
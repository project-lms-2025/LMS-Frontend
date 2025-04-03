import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Hospital, ClipboardList, BarChart3, FilePlus, FileText,
  Users, Repeat, UserRoundPlus, User, ChevronLeft
} from 'lucide-react';

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [role] = useState(() => localStorage.getItem("role") || "teacher");

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
      { title: "Groups and Communities", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
      { title: "Posts and Announcements", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
    ],
    teacher: [
      { title: "Dashboard", icon: <LayoutDashboard size={24} />, url: "teacherDashboard" },
      { title: "Test", icon: <UserRoundPlus size={24} />, url: "testList" },
      { title: "Batches", icon: <Users size={24} />, url: "TBatches" },
      { title: "Courses", icon: <Repeat size={24} />, url: "TCourses" },
      { title: "Test Series", icon: <Users size={24} />, url: "testSeries" },
      { title: "Student Performance", icon: <LayoutDashboard size={24} />, url: "not" },
      { title: "My Schedule", icon: <FileText size={24} />, url: "not" },
      { title: "Classes", icon: <UserRoundPlus size={24} />, url: "not" },
      { title: "Test Series", icon: <UserRoundPlus size={24} />, url: "not" },
      { title: "Notes", icon: <UserRoundPlus size={24} />, url: "not" },
      { title: "Enrolled Students", icon: <UserRoundPlus size={24} />, url: "not" },
      { title: "Batch Status", icon: <UserRoundPlus size={24} />, url: "not" },
      { title: "Groups and Communities", icon: <FilePlus size={24} />, url: "not" },
      { title: "Posts and Announcements", icon: <FilePlus size={24} />, url: "not" },
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

  return (
    <div className={`${open ? "md:w-72" : "w-20"} border-r-[1px] h-screen p-5 pt-2 fixed duration-300 bg-dark-purple/90 backdrop-blur-sm`}>
      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`absolute cursor-pointer -right-3 top-6 w-7 border bg-white border-primary-purple rounded-full ${!open && "rotate-180"}`}
      >
        <ChevronLeft className="text-primary-purple" />
      </button>
      <ul className="pt-2">
        {menus.map((Menu, index) => {
          const isActive = location.pathname.startsWith(`/${Menu.url}`);
          return (
            <li
              key={index}
              className={`flex rounded-md py-2 px-2 mb-2 cursor-pointer hover:bg-primary-purple/50 text-primary-white text-md items-center gap-x-4 ${isActive && "bg-primary-purple text-white"}`}
              onClick={() => handleNavigation(Menu.url, index)}
            >
              <div className={`text-primary-purple ${isActive && " text-white"}`}>{Menu.icon}</div>
              <span className={`${!open && "hidden"} origin-left text-gray-900 hover:font-bold hover:text-primary-purple duration-200`}>
                {Menu.title}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
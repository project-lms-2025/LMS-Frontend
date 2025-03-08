import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Hospital, ClipboardList, BarChart3, FilePlus, FileText, 
  Users, Repeat, UserRoundPlus, User, ChevronLeft
} from 'lucide-react';

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(() => localStorage.getItem("role") || "Teacher");
  const sidebarMenus = {
    owner: [
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
      { title: "Dashboard", icon: <LayoutDashboard size={24} />, url: "/teacherDashboard" },
      { title: "Student Performance", icon: <LayoutDashboard size={24} />, url: "hospital/patient/profileupdate" },
      { title: "My Schedule", icon: <FileText size={24} />, url: "hospital/patients" },
      { title: "Batches", icon: <Users size={24} />, url: "hospital/medicalhistory" },
      { title: "Courses", icon: <Repeat size={24} />, url: "hospital/patient/transfer" },
      { title: "Classes", icon: <UserRoundPlus size={24} />, url: "hospital/patient/register" },
      { title: "Test", icon: <UserRoundPlus size={24} />, url: "hospital/patient/register" },
      { title: "Test Series", icon: <UserRoundPlus size={24} />, url: "hospital/patient/register" },
      { title: "Notes", icon: <UserRoundPlus size={24} />, url: "hospital/patient/register" },
      { title: "Enrolled Students", icon: <UserRoundPlus size={24} />, url: "hospital/patient/register" },
      { title: "Batch Status", icon: <UserRoundPlus size={24} />, url: "hospital/patient/register" },
      { title: "Groups and Communities", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
      { title: "Posts and Announcements", icon: <FilePlus size={24} />, url: "govt/hospitals/register" },
    ],
    student: [
      { title: "Batches", icon: <Repeat size={24} />, url: "patient_transfer" },
      { title: "Courses", icon: <User size={24} />, url: "patient_profile" },
      { title: "Tests", icon: <User size={24} />, url: "studentTestList" },
      { title: "Leaderboard", icon: <User size={24} />, url: "patient_profile" },
      { title: "Announcements", icon: <FileText size={24} />, url: "not" },
      { title: "Planner/Schedule", icon: <LayoutDashboard size={24} />, url: "not" },
      { title: "Notes", icon: <User size={24} />, url: "not" },
      { title: "Grades & Results", icon: <User size={24} />, url: "not" },
      { title: "My Performance", icon: <User size={24} />, url: "not" },
    ],
  };

  const menus = sidebarMenus[role] || sidebarMenus.Teacher;

  const handleNavigation = (path) => {
    if (path) {
      navigate(`/${path}`);
    }
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
      {/* Sidebar Header */}
      {/* <div className="flex gap-x-4 items-center">
        <LayoutDashboard size={28} className="text-primary-purple" />
        <h1 className={`text-primary-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"}`}>
          LMS Hub
        </h1>
      </div> */}
      {/* Sidebar Menus */}
      <ul className="">
        {menus.map((Menu, index) => (
          <li
            key={index}
            className={`flex rounded-md ml- py-2 px-2 cursor-pointer hover:bg-secondary-gray text-primary-white text-md items-center gap-x-4 ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-gray-200"}`}
            onClick={() => handleNavigation(Menu.url)}
          >
            <div className="text-primary-purple">{Menu.icon}</div>
            <span className={`${!open && "hidden"} origin-left text-gray-900 hover:font-bold hover:text-primary-purple duration-200`}>
              {Menu.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

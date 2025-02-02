import './App.css'
import LandingPage  from './pages/LandingPage'
import { Navbar } from './components/Navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import Register from './pages/auth/StudentRegister';
import Teacher from './pages/Dashboard/Teacher';
import StudentDashboard from './pages/Dashboard/Student';
import { StudentProfile } from './pages/Profile/Student';
import Question from './components/Question';
import Quiz from './pages/Quiz';
import StudentTest from './pages/StudentTest';
import TeacherProfile from './pages/Profile/Teacher';
import { ToastContainer } from "react-toastify";
import Forgot from './pages/auth/Forgot';
import ResetPassword from './pages/auth/ResetPassword';
const user = {
  isAuthenticated: true, // Change to false to test redirection
  role: 'Teacher', // Can be 'Teacher' or 'Admin'
};

function App() {
  return (
    <Router className="h-screen" >
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar role={user.role} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/studentSignup" element={<Register />} />

        <Route path="/teacherDashboard" element={<Teacher />} />
        <Route path="/teacherProfile" element={<TeacherProfile />} />
        <Route path="/studentProfile" element={<StudentProfile />} />

        <Route path="/SProfile" element={<StudentProfile />} />
        <Route path="/Ques" element={<Quiz />} />
        <Route path="/Stest" element={<StudentTest />} />
      </Routes>
    </Router>
  )
}

export default App

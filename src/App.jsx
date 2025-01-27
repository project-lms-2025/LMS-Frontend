import { useState } from 'react'
import './App.css'
import LandingPage  from './pages/LandingPage'
import { Navbar } from './components/Navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import Teacher from './pages/Dashboard/Teacher';
import StudentDashboard from './pages/Dashboard/Student';
import { StudentProfile } from './pages/Profile/Student';
import Question from './components/Question';
import Quiz from './pages/Quiz';
import Register from './pages/auth/StudentRegister';
import StudentTest from './pages/StudentTest';

function App() {
  return (
    <Router className="h-screen" >
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/studentSignup" element={<Register />} />

        <Route path="/TDash" element={<Teacher />} />
        <Route path="/SDash" element={<StudentDashboard />} />
        <Route path="/SProfile" element={<StudentProfile />} />
        <Route path="/Ques" element={<Quiz />} />
        <Route path="/Stest" element={<StudentTest />} />
      </Routes>
    </Router>
  )
}

export default App

import './App.css'
import LandingPage from './pages/LandingPage'
import { Navbar } from './components/Navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/StudentRegister';
import Teacher from './pages/Dashboard/Teacher';
import StudentDashboard from './pages/Dashboard/Student';
import { StudentProfile } from './pages/Profile/Student';
import Question from './components/Question';
import Quiz from './pages/Test/QuestionPaper';
import StudentTest from './pages/StudentTest';
import TeacherProfile from './pages/Profile/Teacher';
import { ToastContainer } from "react-toastify";
import Forgot from './pages/auth/Forgot';
import ResetPassword from './pages/auth/ResetPassword';
import AdminRegister from './pages/auth/AdminRegister';
import { useAuth } from './context/AuthContext';
import Classes from './pages/Dashboard/Classes';
import StudentList from './pages/StudentList';
import TeacherList from './pages/TeacherList';
import BatchOverview from './pages/BatchOverview';
import TeacherDetail from './pages/TeacherDetail';
import CreateTestUI from './pages/Test/CreateTest';
import StudentResponse from './pages/Test/StudentResponse';
import QuestionPaper from './pages/Test/QuestionPaper';
import TeacherTestList from './pages/Test/TeacherTestList';
import Rank from './pages/Test/Rank';
import RankBoard from './pages/Test/BatchRank';
import FileUploadComponent from './components/Upload';


function App() {
  const { role } = useAuth();
  return (
    <Router className="h-screen" >
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar role={role} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/studentSignup" element={<Register />} />
        <Route path="/studentProfile" element={<StudentProfile />} />

        <Route path="/studentTest" element={<StudentTest />} />
        <Route path="/studentClass" element={<StudentDashboard />} />

        <Route path="/teacherRegister" element={<AdminRegister />} />
        <Route path="/teacherDashboard" element={<Teacher />} />
        <Route path="/teacherProfile" element={<TeacherProfile />} />
        <Route path="/classes" element={<Classes />} />

        <Route path="/StudentList" element={<StudentList/>} />
        <Route path="/TeacherList" element={<TeacherList/>} />
        <Route path="/BatchOverview" element={<BatchOverview/>} />
        <Route path="/TeacherDetail" element={<TeacherDetail/>} />

        <Route path="/createtest" element={<QuestionPaper/>} />
        {/* Test created by teacher */}

        <Route path="/test" element={<CreateTestUI />} />  
        {/* test given by students */}

        <Route path="/res" element={<StudentResponse/>} />


        <Route path="/testList" element={<TeacherTestList />} />
        <Route path="/rank" element={<Rank />} />
        <Route path="/batchrank" element={<RankBoard />} />
        <Route path="/up" element={<FileUploadComponent />} />


      </Routes>
    </Router>
  )
}

export default App

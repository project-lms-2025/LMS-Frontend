import './App.css'
import LandingPage from './pages/LandingPage'
import { Navbar } from './components/Navbar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/StudentRegister';
import Teacher from './pages/teacher/Teacher';
import StudentDashboard from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/Student';
import Question from './components/Question';
import Quiz from './pages/teacher/CreateTest';
import StudentTest from './pages/StudentTest';
import TeacherProfile from './pages/teacher/TeacherProfile';
import Forgot from './pages/auth/Forgot';
import ResetPassword from './pages/auth/ResetPassword';
import AdminRegister from './pages/auth/AdminRegister';
import { useAuth } from './context/AuthContext';
import Classes from './pages/teacher/Classes';
import StudentList from './pages/owner/StudentList';
import TeacherList from './pages/owner/TeacherList';
import BatchOverview from './pages/owner/BatchOverview';
import TeacherDetail from './pages/owner/TeacherDetail';
import CreateTestUI from './pages/teacher/TestPreview';
import QuestionPaper from './pages/teacher/CreateTest';
import TeacherTestList from './pages/teacher/TeacherTestList';
import Rank from './pages/student/Rank';
import RankBoard from './pages/Test/BatchRank';
import FileUploadComponent from './components/Upload';
import Test from './pages/Test/TesterPAge';
import TestPreview from './pages/teacher/TestPreview';
import CreateTest from './pages/teacher/CreateTest';
import SubmitTest from './pages/student/SubmitTest';
import StudentTestList from './pages/student/StudentTestList';
import NotFound from './components/NotFound';
import TestResultList from './pages/student/AttempedTestList';
import StudentResponse from './pages/student/StudentResponse';
import AllTestSeries from './pages/TestSeries/AllTestSeries';
import AllTestInSeries from './pages/TestSeries/AllTestInSeries';
import CreateTestSeries from './pages/TestSeries/CreateTestSeries';
import CreateTestInSeries from './pages/TestSeries/CreateTestInSeries';
import StudentRegister from './pages/auth/StudentRegisterForm';
import Jupyter from './pages/Jupyter';
import "rsuite/dist/rsuite.css";
import EnrolledBatches from './pages/student/EnrolledBatches';
import EnrolledCourses from './pages/student/EnrolledCourses';
import EnrolledTestSeries from './pages/student/EnrolledTestSeries';
import BatchPayment from './pages/auth/BatchPayment';
import TestSeriesPayment from './pages/auth/TestSeriesPayment'
import { Toaster } from 'react-hot-toast';
import Batch from './pages/teacher/Batch';
import Course from './pages/teacher/Course';
import TeacherLanding from './pages/TeacherLanding';
import Instructions from './components/Instruction';


function App() {
  const { role, isLoggedIn } = useAuth();
  console.log("Role:", role);
  console.log("IsLoggedIn:", isLoggedIn);
  return (
    <Router className="h-screen" >
      <Toaster autoClose={3000} />
      <Navbar role={role} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/studentSignup" element={<Register />} />   {/* Student registration */}
        <Route path="/studentSignup2" element={<StudentRegister />} />   {/* Student registration */}
        <Route path="/payment_batch/:batch_id" element={<BatchPayment />} />
        {/* Student Routes */}
        <Route path="/studentClass" element={isLoggedIn && role === 'student' ? <StudentDashboard /> : <Navigate to="/" />} />
        <Route path="/studentProfile" element={isLoggedIn && role === 'student' ? <StudentProfile /> : <Navigate to="/" />} />
        <Route path="/batches" element={isLoggedIn && role === 'student' ? <EnrolledBatches /> : <Navigate to="/" />} />
        <Route path="/courses" element={isLoggedIn && role === 'student' ? <EnrolledCourses /> : <Navigate to="/" />} />
        <Route path="/studentTestList" element={isLoggedIn && role === 'student' ? <StudentTestList /> : <Navigate to="/" />} />
        <Route path="/submittest" element={isLoggedIn && role === 'student' ? <SubmitTest/> : <Navigate to="/" />} />
        <Route path="/studentresponse/:resultId" element={isLoggedIn && role === 'student' ? <StudentResponse/> : <Navigate to="/" />} /> 
        <Route path="/rank" element={isLoggedIn && role === 'student' ? <Rank /> : <Navigate to="/" />} />
        <Route path="/batchrank" element={isLoggedIn && role === 'student' ? <RankBoard /> : <Navigate to="/" />} />
        <Route path="/resultList" element={isLoggedIn && role === 'student' ? <TestResultList /> : <Navigate to="/" />} />
        <Route path="/instructions" element={isLoggedIn && role === 'student' ? <Instructions /> : <Navigate to="/" />} />

        {/* Teacher Routes */}
        <Route path="/teacherDashboard" element={isLoggedIn && role === 'teacher' ? <Teacher /> : <Navigate to="/" />} />
        <Route path="/TBatches" element={isLoggedIn && role === 'teacher' ? <Batch /> : <Navigate to="/" />} />
        <Route path="/TCourses" element={isLoggedIn && role === 'teacher' ? <Course /> : <Navigate to="/" />} />
        <Route path="/teacherProfile" element={isLoggedIn && role === 'teacher' ? <TeacherProfile /> : <Navigate to="/" />} />
        <Route path="/classes" element={isLoggedIn && role === 'teacher' ? <Classes /> : <Navigate to="/" />} />
        <Route path="/createtest" element={isLoggedIn && role === 'teacher' ? <CreateTest/> : <Navigate to="/" />} /> {/* Test created by teacher merge */}
        <Route path="/testList" element={isLoggedIn && role === 'teacher' ? <TeacherTestList /> : <Navigate to="/" />} />
        <Route path="/testpreview" element={isLoggedIn && role === 'teacher' ? <TestPreview /> : <Navigate to="/" />} />  {/* test given by students */}

        {/* Test Series */}
        <Route path="/testSeries" element={isLoggedIn && role === 'teacher' ? <AllTestSeries /> : <Navigate to="/" />} />  {/* test given by students DONE */} 
        <Route path="/testInSeries/:seriesId" element={isLoggedIn && role === 'teacher' ? <AllTestInSeries /> : <Navigate to="/" />} />  {/* test given by students */}
        <Route path="/enrolledTestSeries" element={isLoggedIn && role === 'student' ? <EnrolledTestSeries /> : <Navigate to="/" />} />  {/* enrolled test series */}
        <Route path="/createTestSeries" element={isLoggedIn && role === 'teacher' ? <CreateTestSeries /> : <Navigate to="/" />} />  {/* test given by students */}
        <Route path="/createTestInSeries" element={isLoggedIn && role === 'teacher' ? <CreateTestInSeries/> : <Navigate to="/" />} /> {/* Test created by teacher DONE */} 
        <Route path="/test_series_preview" element={isLoggedIn && role === 'teacher' ? <TestPreview /> : <Navigate to="/" />} />  {/* test given by students */}
        <Route path="/payment_ts/:series_id" element={isLoggedIn && role === 'student' ? <TestSeriesPayment /> : <Navigate to="/" />} />
        {/* Owner Routes */}
        <Route path="/teacherRegister" element={isLoggedIn && role === 'admin' ? <AdminRegister /> : <Navigate to="/" />} />
        <Route path="/StudentList" element={isLoggedIn && role === 'admin' ? <StudentList/> : <Navigate to="/" />} />
        <Route path="/TeacherList" element={isLoggedIn && role === 'admin' ? <TeacherList/> : <Navigate to="/" />} />
        <Route path="/BatchOverview" element={isLoggedIn && role === 'admin' ? <BatchOverview/> : <Navigate to="/" />} />
        <Route path="/TeacherDetail" element={isLoggedIn && role === 'admin' ? <TeacherDetail/> : <Navigate to="/" />} />

        <Route path="/up" element={<FileUploadComponent />} />
        <Route path="/x" element={<Test />} />
        {/* <Route path="/tbatch" element={<TBatch />} /> */}
        <Route path="/not" element={<NotFound />} />

        <Route path="/jupyter" element={<Jupyter />} />
        <Route path="/tl" element={<TeacherLanding />} />
      </Routes>
    </Router>
  )
}

export default App

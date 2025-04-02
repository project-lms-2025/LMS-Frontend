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
import Batch from './pages/student/Batch';
import TBatch from './pages/teacher/Batches';
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


function App() {
  const { role } = useAuth();
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
        <Route path="/studentClass" element={<StudentDashboard />} />
        <Route path="/studentProfile" element={<StudentProfile />} />
        <Route path="/batches" element={<EnrolledBatches />} />
        <Route path="/courses" element={<EnrolledCourses />} />
        <Route path="/studentTestList" element={<StudentTestList />} />
        <Route path="/submittest" element={<SubmitTest/>} />
        <Route path="/studentresponse/:resultId" element={<StudentResponse/>} /> 
        <Route path="/rank" element={<Rank />} />
        <Route path="/batchrank" element={<RankBoard />} />
        <Route path="/resultList" element={<TestResultList />} />


        {/* Teacher Routes */}
        <Route path="/teacherDashboard" element={<Teacher />} />
        <Route path="/TBatches" element={<TBatch />} />
        <Route path="/teacherProfile" element={<TeacherProfile />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/createtest" element={<CreateTest/>} /> {/* Test created by teacher */}
        <Route path="/testList" element={<TeacherTestList />} />
        <Route path="/testpreview" element={<TestPreview />} />  {/* test given by students */}

        {/* Test Series */}
        <Route path="/testSeries" element={<AllTestSeries />} />  {/* test given by students DONE */} 
        <Route path="/testInSeries/:seriesId" element={<AllTestInSeries />} />  {/* test given by students */}
        <Route path="/enrolledTestSeries" element={<EnrolledTestSeries />} />  {/* enrolled test series */}
        <Route path="/createTestSeries" element={<CreateTestSeries />} />  {/* test given by students */}
        <Route path="/createTestInSeries" element={<CreateTestInSeries/>} /> {/* Test created by teacher DONE */} 
        <Route path="/test_series_preview" element={<TestPreview />} />  {/* test given by students */}
        <Route path="/payment_ts/:series_id" element={<TestSeriesPayment />} />
        {/* Owner Routes */}
        <Route path="/teacherRegister" element={<AdminRegister />} />
        <Route path="/StudentList" element={<StudentList/>} />
        <Route path="/TeacherList" element={<TeacherList/>} />
        <Route path="/BatchOverview" element={<BatchOverview/>} />
        <Route path="/TeacherDetail" element={<TeacherDetail/>} />


        <Route path="/up" element={<FileUploadComponent />} />
        <Route path="/x" element={<Test />} />
        <Route path="/not" element={<NotFound />} />

        <Route path="/jupyter" element={<Jupyter />} />
      </Routes>
    </Router>
  )
}

export default App

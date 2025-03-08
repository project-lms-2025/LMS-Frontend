import React, { useEffect, useState } from 'react';
import { getAllTests } from '../../api/test';
import { ToastContainer, toast } from 'react-toastify';
import { ChevronRight, Eye, ArrowLeftRight } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

// Dummy helper functions – adjust these as needed
const formatDateTime = (dateString, timeString) => {
  // For simplicity, just join date and time.
  return `${dateString} ${timeString}`;
};

const getStatusColor = (status) => {
  // Return a className for color based on test status.
  switch (status) {
    case "active": return "text-green-500";
    case "completed": return "text-blue-500";
    case "missed": return "text-red-500";
    default: return "text-gray-500";
  }
};

const getStatusIcon = (status) => {
  // Return an icon component based on status.
  switch (status) {
    case "active": return <span>🟢</span>;
    case "completed": return <span>✅</span>;
    case "missed": return <span>❌</span>;
    default: return <span>ℹ️</span>;
  }
};

const onStartTest = (test) => {
  // Navigate or perform action to start the test.
  console.log("Starting test:", test.test_id);
};

const onViewResults = () => {
  console.log("Viewing results");
};

const TeacherTestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // Fetch tests from backend when component mounts
  useEffect(() => {
    async function fetchTests() {
      try {
        const data = await getAllTests();
        setTests(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load tests");
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  if (loading) return <div>Loading tests...</div>;

  return (
    <div className='m-0' >
      <Sidebar open={open} setOpen={setOpen} />
      {/* Main content */}
      <div
        className={`transition-all duration-300 ${open ? "md:ml-[20rem] ml-56 mr-4  w-[40%] md:w-[75%]" : "ml-24 mr-2"} md:w-[90%]  w-[95%] md:mt `}
      >
    <div className="min-h-screen bg-secondary-gray dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-primary-white">
            My Tests
          </h1>
        </div>
  
        <div className="bg-primary-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {tests.map((test) => (
              <div
                key={test.test_id}
                className="p-6 hover:bg-secondary-gray dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={getStatusColor("active")}>
                      {getStatusIcon("active")}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-primary-white">
                        {test.title}
                      </h3>
                      {/* If no subject exists, you can display the course ID */}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {test.course_id}
                      </p>
                    </div>
                  </div>
  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-primary-white">
                        {formatDateTime(test.schedule_date, test.schedule_time)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Duration: {test.duration} mins
                      </p>
                    </div>
  
                    {/* For demonstration purposes, assume test is active */}
                    { "active" === "active" && (
                      // {test.status === "active" && (
                        <button
                          onClick={() =>
                            navigate('/submittest', { state: { test_id: test.test_id } })
                          }
                          className="flex items-center px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        >
                          Start Test
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </button>
                      // )}
                    )}
  
                    {test.status === "completed" && (
                      <button
                        onClick={onViewResults}
                        className="flex items-center px-4 py-2 bg-secondary-coral text-white rounded-lg hover:bg-red-500 transition-colors duration-200"
                      >
                        View Results
                        <Eye className="w-4 h-4 ml-2" />
                      </button>
                    )}
  
                    {test.status === "missed" && (
                      <button
                        onClick={() => onStartTest(test)}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        Retake Test
                        <ArrowLeftRight className="w-4 h-4 ml-2" />
                      </button>
                    )}
                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    
  );
};

export default TeacherTestList;

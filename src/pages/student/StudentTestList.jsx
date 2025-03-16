import React, { useEffect, useState } from 'react';
import { getAllTests, attemptedTest } from '../../api/test';
import { ToastContainer, toast } from 'react-toastify';
import { ChevronRight, Eye, ArrowLeftRight, CheckCircle } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';

// Helper function to check if a test date is in the past
const isTestDatePassed = (scheduleDate, scheduleTime) => {
  const testDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
  return testDateTime < new Date();
};

const formatDateTime = (dateString, timeString) => {
  return `${dateString} ${timeString}`;
};

const StudentTestList = () => {
  const [tests, setTests] = useState([]);
  const [attemptedTests, setAttemptedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestsAndAttemptedTests = async () => {
      try {
        const [allTests, attempted] = await Promise.all([
          getAllTests(),
          attemptedTest()
        ]);

        setTests(allTests);
        setAttemptedTests(attempted);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load tests");
        setLoading(false);
      }
    };

    fetchTestsAndAttemptedTests();
  }, []);

  const isTestAttempted = (testId) => {
    return attemptedTests.some(attemptedTest => attemptedTest.test_id === testId);
  };

  if (loading) return <Loading/>;

  return (
    <div className='m-0'>
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className={`transition-all duration-300 ${open ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[75%]" : "ml-24 mr-2"} md:w-[90%] w-[95%] md:mt`}
      >
        <div className="min-h-screen dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
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
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-primary-white">
                            {test.title}
                          </h3>
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

                        {isTestAttempted(test.test_id) ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span>Attempted</span>
                          </div>
                        ) : !isTestDatePassed(test.schedule_date, test.schedule_time) ? (
                          <button
                            onClick={() =>
                              navigate('/submittest', { state: { test_id: test.test_id } })
                            }
                            className="flex items-center px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                          >
                            Start Test
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </button>
                        ) : (
                          <div className="text-red-500">Test Expired</div>
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

export default StudentTestList;

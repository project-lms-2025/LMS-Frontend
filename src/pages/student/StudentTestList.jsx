import React, { useEffect, useState } from 'react';
import { getEnrolledTests, attemptedTest } from '../../api/test';
import { Toaster, toast } from 'react-hot-toast';
import { ChevronRight, Eye, ArrowLeftRight, CheckCircle, Clock, CalendarClock, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';

// Helper function to check if a test date is in the past
const isTestDatePassed = (scheduleDate, scheduleTime) => {
  const testDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
  return testDateTime < new Date();
};

const formatDateTime = (dateTimeString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeString).toLocaleString(undefined, options);
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
          getEnrolledTests(),
          attemptedTest()
        ]);

        setTests(allTests.data);
        setAttemptedTests(attempted.data);
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

  if (loading) return <Loading />;

  return (
    <div className='m-0'>
      <div className=" dark:bg-gray-900 py-12 px-">
        <Toaster />
        <div className="w-full mx-aut">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-primary-white">
              My Tests
            </h1>
          </div>

          <div className="bg-primary-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200 space-y-4 dark:divide-gray-700">
              {tests.map((test) => (
                <div
                  key={test.test_id}
                  className="flex justify-between  bg-primary-purple/70 items-center p-4  dark:bg-gray-800 rounded-lg shadow"
                >
                  {/* Left side - test info */}
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-2 text-white dark:text-primary-white">
                      {test.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <p className="text-base items-center text-black dark:text-gray-300">
                        <File size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> {test?.questions_count} Questions
                      </p>
                      <p className="text-sm m-0 text-black dark:text-gray-300">
                        <Clock size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> Duration {test.duration}
                      </p>
                      <p className="text-sm m-0 text-black dark:text-gray-300">
                        <CalendarClock size={25} className="inline bg-white p-1 text-primary-purple rounded-lg" /> Start on {formatDateTime(test.schedule_start)}, End on {formatDateTime(test.schedule_end)}
                      </p>
                    </div>
                  </div>
                   {/* Right side - status and start button */}
                  <div className="flex items-center space-x-4">
                    
                    {isTestAttempted(test.test_id) ? (
                      <div className="flex items-center text-blue-700 bg-blue-100 rounded-full px-3 py-1">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>Attempted</span>
                      </div>
                    ) : !isTestDatePassed(test.schedule_date, test.schedule_time) ? (
                      <button
                        onClick={() =>
                          navigate('/instructions', { state: { test_id: test.test_id } })
                        }
                        className="flex items-center px-4 py-2 text-primary-purple bg-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        Start Test
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <div className="text-red-500">Test Expired</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTestList;

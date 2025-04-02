import React, { useState, useEffect } from 'react';
import { ChevronRight, Crown, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEnrolledTests, getLeaderboard } from '../../api/test';
import Sidebar from '../../components/Sidebar';
import { Toaster, toast } from 'react-hot-toast';

const Rank = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch all tests on component mount
  useEffect(() => {
    async function fetchTests() {
      try {
        const data = await getEnrolledTests();
        // getEnrolledTests might return an array directly or { success: true, data: [...] }
        const testsArray = Array.isArray(data) ? data : data.data;
        setTests(testsArray);
      } catch (error) {
        toast.error("Failed to load tests.");
        console.error("Error fetching tests:", error);
      } finally {
        setLoadingTests(false);
      }
    }
    fetchTests();
  }, []);

  // Fetch leaderboard for the selected test
  useEffect(() => {
    async function fetchLeaderboard() {
      if (selectedTestId) {
        try {
          setLoadingLeaderboard(true);
          const data = await getLeaderboard(selectedTestId);
          if (data && data.results && Array.isArray(data.results)) {
            // Sort leaderboard descending by final_score (as numbers)
            const sorted = data.results.sort((a, b) => Number(b.final_score) - Number(a.final_score));
            setLeaderboard(sorted);
          } else {
            setLeaderboard([]);
          }
        } catch (error) {
          toast.error("Failed to load leaderboard.");
          console.error("Error fetching leaderboard:", error);
        } finally {
          setLoadingLeaderboard(false);
        }
      }
    }
    fetchLeaderboard();
  }, [selectedTestId]);

  // Format date and time if needed (example)
  const formatDateTime = (dateStr, timeStr) => {
    return `${dateStr} at ${timeStr}`;
  };

  // Add rank to each leaderboard entry
  const rankedResults = leaderboard.map((result, index) => ({
    ...result,
    rank: index + 1,
  }));

  // Highlight top 3 rows with theme colors
  const highlightRow = (rank) => {
    if (rank === 1) return "bg-yellow-50";
    if (rank === 2) return "bg-blue-50";
    if (rank === 3) return "bg-orange-50";
    return "";
  };

  // Handler to select a test and view its leaderboard
  const handleViewLeaderboard = (testId) => {
    setSelectedTestId(testId);
  };

  // Handler to go back to the tests list
  const handleBackToTests = () => {
    setSelectedTestId(null);
    setLeaderboard([]);
  };

  return (
    <div className='m-0' >
      <Sidebar open={open} setOpen={setOpen} />
      {/* Main content */}
      <div
        className={`transition-all duration-300 ${open ? "md:ml-[20rem] ml-56 mr-4  w-[40%] md:w-[75%]" : "ml-24 mr-2"} md:w-[90%]  w-[95%] md:mt `}
      >
        <div className="max-w-4xl mx-auto">
          <Toaster />
          {!selectedTestId ? (
            // Test List View
            <>
              <h1 className="text-3xl font-bold pt-6 text-gray-900 dark:text-primary-white">Completed Tests</h1>
              {loadingTests ? (
                <div className="text-center text-xl">Loading tests...</div>
              ) : tests.length > 0 ? (
                <div className="space-y-4">
                  {tests.map((test) => (
                    <div key={test.test_id} className="bg-primary-white dark:bg-gray-800 rounded-xl border mt-4 shadow-lg p-6">
                      <div className="flex justify-between items-center"> 
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-primary-white">{test.title}</h2>
                          {/* <p className="text-gray-600 dark:text-gray-300 mt-2">{test.description}</p> */}
                          Date & Time: <span className="font-semibold">{formatDateTime(test.schedule_date, test.schedule_time)}</span>

                        </div>
                          <button
                            onClick={() => handleViewLeaderboard(test.test_id)}
                            className=" flex items-center gap-2 px-4 py-3 bg-primary-purple text-primary-white rounded-lg hover:bg-primary-purple/90 transition-colors"
                          >
                            View Leaderboard <ChevronRight size={20} />
                          </button>
                          
                      </div>


                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No tests available.</p>
              )}
            </>
          ) : (
            // Leaderboard View
            <>
              <div className="flex justify-between items-centre pt-6 mb-6">
                <h1 className="text-3xl  font-bold text-gray-900 dark:text-primary-white">Test Leaderboard</h1>
                <button
                  onClick={handleBackToTests}
                  className="px-4 py-2 bg-secondary-coral text-white rounded-lg hover:bg-secondary-coral/80 transition-colors"
                >
                  Back to Tests
                </button>
              </div>
              {loadingLeaderboard ? (
                <div className="text-center text-xl">Loading leaderboard...</div>
              ) : rankedResults.length > 0 ? (
                <div className="bg-primary-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {rankedResults.map((result) => (
                      <div key={result.score_id} className={`p-6 hover:bg-secondary-gray dark:hover:bg-gray-700 transition-colors duration-200 ${highlightRow(result.rank)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl font-bold">
                              {result.rank === 1 ? (
                                <span className="flex items-center gap-1 text-yellow-600">
                                  <Crown size={18} />
                                  {result.rank}
                                </span>
                              ) : result.rank === 2 ? (
                                <span className="flex items-center gap-1 text-blue-600">
                                  <Award size={18} />
                                  {result.rank}
                                </span>
                              ) : result.rank === 3 ? (
                                <span className="flex items-center gap-1 text-orange-600">
                                  <Award size={18} />
                                  {result.rank}
                                </span>
                              ) : (
                                <span>{result.rank}</span>
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-primary-white">
                                {result.student_name || "Anonymous"}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Score: {result.final_score}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">No leaderboard data available.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rank;

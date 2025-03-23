import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllTestSeries } from '../../api/testSeries';
import Sidebar from '../../components/Sidebar';

const AllTestSeries = () => {
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTestSeries = async () => {
      try {
        const data = await getAllTestSeries();
        console.log(data);
        // Check if API returns an array directly or as data property
        if (Array.isArray(data)) {
          setTestSeries(data);
        } else if (data && data.success && Array.isArray(data.data)) {
          setTestSeries(data.data);
        } else {
          setTestSeries([]);
        }
      } catch (err) {
        setError(err.message);
        toast.error('Failed to fetch test series.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestSeries();
  }, []);

  return (
    <div className='m-0' >
      <Sidebar open={open} setOpen={setOpen} />
      {/* Main content */}
      <div
        className={`transition-all duration-300 ${open ? "md:ml-[20rem] ml-56 mr-4  w-[40%] md:w-[75%]" : "ml-24 mr-2"} md:w-[90%]  w-[95%] md:mt `}
      >
        <div className="min-h-screen bg-secondary-gray dark:bg-gray-900 p-6">
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-primary-purple dark:text-primary-white">
              All Test Series
            </h1>
            {loading ? (
              <div className="text-center text-primary-purple dark:text-accent-skyblue">
                Loading...
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : testSeries.length === 0 ? (
              <div className="text-center text-primary-purple dark:text-accent-skyblue">
                No test series found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {testSeries.map((series) => (
                  <div
                    key={series.series_id}
                    className="bg-primary-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between"
                  >
                    <h2 className="text-xl font-semibold text-primary-purple dark:text-primary-white">
                      {series.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {series.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total Tests: {series.total_tests}
                      </span>
                      <button
                        onClick={() => navigate(`/testInSeries/${series.series_id}`)}
                        className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-purple/80 transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default AllTestSeries;

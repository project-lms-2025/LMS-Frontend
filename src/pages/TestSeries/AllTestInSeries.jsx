import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAllTestsInSeries } from '../../api/testSeries';
import Loading from '../../components/Loading';
import Sidebar from '../../components/Sidebar';
import { Plus } from 'lucide-react';
import { getAllTests, getTestById } from '../../api/test';

const AllTestInSeries = () => {
  const { seriesId } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getAllTests("SERIES_TEST");
        console.log("Hi", data)
        // If the API returns an array directly
        if (Array.isArray(data)) {
          setTests(data);
        }
        // Otherwise, if the API returns an object with success flag and data array
        else if (data && data.success && Array.isArray(data.data)) {
          setTests(data.data);
        } else {
          setTests([]);
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to fetch tests in series.");
      } finally {
        setLoading(false);
      }
    };

    if (seriesId) {
      fetchTests();
    }
  }, [seriesId]);

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
            <div className='flex justify-between ' >
              <h1 className="text-3xl font-bold text-primary-purple dark:text-primary-white">
                Tests in Series
              </h1>
              <a className="flex  justify-center items-center gap-2 px-3 p-1 rounded-lg bg-white border border-gray-300 hover:bg-gray-50" href="/createtest?type=SERIES_TEST">Create Test<Plus /> </a>
            </div>
            {loading ? (
              <Loading />
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : tests.length === 0 ? (
              <div className="text-center text-primary-purple dark:text-accent-skyblue">
                No tests found in this series.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {tests.map((test) => (
                  <div
                    key={test.test_id}
                    className="bg-primary-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between"
                  >
                    <h2 className="text-xl font-semibold text-primary-purple dark:text-primary-white">
                      {test.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {test.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Duration: {test.duration} minutes
                      </span>
                      <button
                        onClick={() =>
                          window.open(`/test_series_preview?test_id=${test.test_id}?test_type=series`, '_blank')
                        }
                        className="px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-primary-purple/80 transition-colors"
                      >
                        View Test
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

export default AllTestInSeries;

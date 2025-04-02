import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';
import { getEnrollmentBatches } from '../../api/auth';
import { getEnrolledTestSeries } from '../../api/testSeries';
import toast, { Toaster } from 'react-hot-toast';

const EnrolledTestSeries = () => {
  const [testSeries, setTestSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTestSeries = async () => {
      try {
        setLoading(true);
        const response = await getEnrolledTestSeries();
        console.log("Enrolled test series response:", response);
        // Check if response.success is true and process the test series data.
        if (response && response.success) {
          // If response.data is not an array, wrap it in one.
          const seriesData = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setTestSeries(seriesData);
        } else {
          setTestSeries([]);
          setError("No enrolled test series found.");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load enrolled test series.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestSeries();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          open
            ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[75%]"
            : "ml-24 mr-2"
        } md:w-[90%] w-[95%]`}
      >
        <div className="min-h-[90vh] py-12 px-4 sm:px-6 lg:px-8">
          <Toaster />
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-purple mb-6">
              Enrolled Test Series
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {testSeries.length > 0 ? (
              <div className="bg-primary-white rounded-xl shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {testSeries.map((series) => (
                    <div
                      key={series.series_id} // Changed from batch_id to series_id
                      className="p-6 hover:bg-secondary-gray transition-colors duration-200"
                    >
                      <h2 className="text-xl font-semibold text-primary-purple">
                        {series.title}  {/* Changed from batch_name to title */}
                      </h2>
                      <p className="text-gray-600">
                        Created at: {new Date(series.created_at).toLocaleString()}
                      </p>
                      {/* You can add additional series details here */}
                      <p className="text-gray-600 mt-2">
                        Total Tests: {series.total_tests || 0}
                      </p>
                      <p className="text-gray-600 mt-2">
                        Description: {series.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No enrolled test series available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledTestSeries;

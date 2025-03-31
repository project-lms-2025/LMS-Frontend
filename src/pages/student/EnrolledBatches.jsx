import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';
import { getEnrollmentBatches } from '../../api/auth';

const EnrolledBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await getEnrollmentBatches();
        // Check if response.success is true and process the batch data.
        if (response && response.success) {
          // If response.batch is not an array, wrap it in one.
          const batchData = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setBatches(batchData);
        } else {
          setBatches([]);
          setError("No enrolled batches found.");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load enrolled batches.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
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
          <ToastContainer />
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-purple mb-6">
              Enrolled Batches
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {batches.length > 0 ? (
              <div className="bg-primary-white rounded-xl shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {batches.map((batch) => (
                    <div
                      key={batch.batch_id}
                      className="p-6 hover:bg-secondary-gray transition-colors duration-200"
                    >
                      <h2 className="text-xl font-semibold text-primary-purple">
                        {batch.batch_name}
                      </h2>
                      <p className="text-gray-600">
                        Created at: {new Date(batch.created_at).toLocaleString()}
                      </p>
                      {/* You can add additional batch details here */}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No enrolled batches available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolledBatches;

import React, { useState, useEffect } from 'react';
import { enrollUser, getAllBatches, getEnrollmentBatches } from '../api/auth';

// A card component for a single available batch
const BatchCard = ({ batch, onEnroll, isEnrolled }) => {
  return (
    <div className="bg-secondary-gray p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary-purple mb-2">
        {batch.batch_name}
      </h2>
      <p className="text-gray-600 mb-2">{batch.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        Created on: {new Date(batch.created_at).toLocaleDateString()}
      </p>
      {isEnrolled ? (
        <button
          disabled
          className="bg-gray-500 text-white font-semibold py-2 px-4 rounded cursor-not-allowed"
        >
          You are already registered
        </button>
      ) : (
        <button
          onClick={() => onEnroll(batch.batch_id)}
          className="bg-primary-purple hover:bg-secondary-coral text-primary-white font-semibold py-2 px-4 rounded"
        >
          Enroll Now
        </button>
      )}
    </div>
  );
};

const EnrollBatch = () => {
  const [batches, setBatches] = useState([]);
  const [enrolledBatches, setEnrolledBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all available batches from the API
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await getAllBatches();
      if (response && response.success && Array.isArray(response.data)) {
        console.log("Available batches:", response.data);
        setBatches(response.data);
      } else {
        setBatches([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrolled batches from the API
  const fetchEnrolledBatches = async () => {
    try {
      const response = await getEnrollmentBatches();
      console.log("Raw enrolled batches response:", response);
      if (response && response.success) {
        // If response.batch is an array, use it directly; if it's an object, wrap it in an array.
        const enrolledData = Array.isArray(response.batch)
          ? response.batch
          : [response.batch];
        console.log("Enrolled batches:", enrolledData);
        setEnrolledBatches(enrolledData);
      } else {
        setEnrolledBatches([]);
      }
    } catch (err) {
      console.error("Error fetching enrolled batches:", err);
    }
  };

  // Enrollment handler using enrollUser API call
  const handleEnroll = async (batchId) => {
    const enrollmentData = {
      batch_id: batchId,
      payment_amount: 100.0, // Replace with actual payment amount or input from the user
      payment_status: "successful",
      enrollment_type: "batch",
    };

    try {
      const response = await enrollUser(enrollmentData);
      console.log("Enrollment successful:", response);
      // After enrolling, refresh the enrolled batches list
      fetchEnrolledBatches();
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchEnrolledBatches();
  }, []);

  if (loading) {
    return <div>Loading batches...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Available Batches</h1>
      {batches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => {
            const isEnrolled = enrolledBatches.some(
              (enrolled) => enrolled.batch_id === batch.batch_id
            );
            return (
              <BatchCard
                key={batch.batch_id}
                batch={batch}
                onEnroll={handleEnroll}
                isEnrolled={isEnrolled}
              />
            );
          })}
        </div>
      ) : (
        <div>No batches available.</div>
      )}
    </div>
  );
};

export default EnrollBatch;

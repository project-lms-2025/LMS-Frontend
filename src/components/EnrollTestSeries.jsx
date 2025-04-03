import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { getAllTestSeries, getEnrolledTestSeries } from '../api/test';

// Card Component for a Test Series
const Testcard = ({ series, onEnroll, isEnrolled }) => {
  return (
    <div className="bg-secondary-gray p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary-purple mb-2">
        {series.title}
      </h2>
      <p className="text-gray-600 mb-2">{series.description}</p>
      <p className="text-sm text-gray-500 mb-4">
        Created on: {new Date(series.created_at).toLocaleDateString()}
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
          onClick={() => onEnroll(series.series_id)}
          className="bg-primary-purple hover:bg-secondary-coral text-primary-white font-semibold py-2 px-4 rounded"
        >
          Enroll Now
        </button>
      )}
    </div>
  );
};

const EnrollTestSeries = () => {
  const [testSeriesList, setTestSeriesList] = useState([]);
  const [enrolledBatches, setEnrolledBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check auth token on mount
  useEffect(() => {
    // const authToken = localStorage.getItem("authToken");
    // if (!authToken) {
    //   navigate("/signin");
    // }
  }, [navigate]);

  // Fetch available test series
  const fetchTestSeries = async () => {
    try {
      setLoading(true);
      const response = await getAllTestSeries();
      console.log("Available test series:", response);
      if (response && response.success && Array.isArray(response.data)) {
        setTestSeriesList(response.data);
      } else {
        setTestSeriesList([]);
      }
    } catch (err) {
      setError("Failed to fetch test series.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrolled test series
  const fetchEnrolledBatches = async () => {
    try {
      const response = await getEnrolledTestSeries();
      console.log("Enrolled test series:", response);
      if (response && response.success) {
        const enrolledData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setEnrolledBatches(enrolledData);
      } else {
        setEnrolledBatches([]);
      }
    } catch (err) {
      console.log("No enrolled test series found");
    }
  };

  useEffect(() => {
    fetchTestSeries();
    fetchEnrolledBatches();
  }, []);

  // Handle enrollment redirect
  const handleEnroll = (seriesId) => {
    // const authToken = localStorage.getItem("authToken");
    // if (!authToken) {
    //   navigate("/signin");
    //   return;
    // }
    navigate(`/payment_ts/${seriesId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-primary-purple border-secondary-gray rounded-full animate-spin"></div>
        <p className="mt-4 text-xl font-semibold text-primary-purple">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Available Test Series</h1>
      {testSeriesList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testSeriesList.map((series) => {
            const isEnrolled = enrolledBatches.some(
              (enrolled) => enrolled.series_id === series.series_id
            );
            return (
              <Testcard
                key={series.series_id}
                series={series}
                onEnroll={handleEnroll}
                isEnrolled={isEnrolled}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500">No test series available right now.</div>
      )}
    </div>
  );
};

export default EnrollTestSeries;

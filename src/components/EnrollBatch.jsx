import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollUser, getAllBatches, getEnrollmentBatches } from '../api/auth';
import Loading from './Loading';
import toast from 'react-hot-toast';

const BatchCard = ({ batch, onEnroll, isEnrolled }) => {
  return (
    <div className="bg-secondary-gray  rounded-lg shadow-md">
      <img src={batch.banner} alt="" />
      <div className="p-6" >

      <h2 className="text-2xl font-bold text-primary-purple mb-2">
        {batch.batch_name}
      </h2>
      <p className="text-black text-lg mb-1">{batch.description}</p>
      <p className="text-lg text-black mb-1">
        Created on: {new Date(batch.created_at).toLocaleDateString()}
      </p>
      <p className="text-xl text-primary-purple mb-3 font-bold ">
        Cost: ₹{batch.cost} 
          {/* <span className="strike line-through">₹4000</span> */}
      </p>
      {isEnrolled ? (
        <button
        disabled
        className="bg-black text-white font-semibold py-2 px-4 rounded cursor-not-allowed"
        >
          You are already registered
        </button>
      ) : (
        <button
        onClick={() => onEnroll(batch.batch_id)}
        className="bg-primary-purple w-full hover:bg-primary-purple/50 text-primary-white font-semibold py-2 px-4 rounded"
        >
          Enroll Now
        </button>
      )}
      </div>
    </div>
  );
};

const EnrollBatch = () => {
  const [batches, setBatches] = useState([]);
  const [enrolledBatches, setEnrolledBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check for auth token on mount; if missing, redirect to login
  // useEffect(() => {
  //   const authToken = localStorage.getItem("authToken");
  //   if (!authToken) {
  //     navigate("/signin");
  //   }
  // }, [navigate]);

  // Fetch all available batches from the API
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await getAllBatches();
      console.log("Available batches:", response);
      if (response && response.success && Array.isArray(response.data)) {
        // console.log("Available batches:", response.data);
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
      console.log(response)
      // console.log("Raw enrolled batches response:", response);
      if (response && response.success) {
        const enrolledData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        // console.log("Enrolled batches:", enrolledData);
        setEnrolledBatches(enrolledData);
      } else {
        setEnrolledBatches([]);
      }
    } catch (err) {
      console.log("No batches found");
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchEnrolledBatches();
  }, []);

  // Enrollment handler: if logged in, navigate to the payment page with batch_id.
  const handleEnroll = (batchId) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Please sign in to enroll", { duration: 2000 });
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
      return;
    }
    toast.success("Redirecting to payment page...", { duration: 2000 });
    setTimeout(() => {
      navigate(`/payment_batch/${batchId}`);
    }, 1000);
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
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Available Batches</h1>
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
        <Loading />
      )}
    </div>
  );
};

export default EnrollBatch;

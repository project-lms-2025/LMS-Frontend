import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { getAllBatches, getCoursesByBatchId } from '../../api/auth';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Loading from '../../components/Loading';

const Teacher = () => {
  const [open, setOpen] = useState(false);
  const [batches, setBatches] = useState([]); // Store batches
  const [courses, setCourses] = useState({}); // Store courses for each batch
  const [loading, setLoading] = useState(false); // Store loading state
  const [error, setError] = useState(""); // Store error state
  const [expandedBatches, setExpandedBatches] = useState({}); // State to handle expanded batches

  // Fetch batches
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await getAllBatches();
      if (response && response.success && Array.isArray(response.data)) {
        setBatches(response.data);
        // Fetch courses for the batches
        fetchCoursesForBatches(response.data);
      } else {
        setBatches([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses for the batches
  const fetchCoursesForBatches = async (batchList) => {
    const courseMap = {};
    for (const batch of batchList) {
      try {
        const courseData = await getCoursesByBatchId(batch.batch_id);
        // Store the courses for the batch
        courseMap[batch.batch_id] = courseData.success ? courseData.data : [];
      } catch (err) {
        console.error(`Error fetching courses for batch ${batch.batch_id}:`, err);
        courseMap[batch.batch_id] = [];
      }
    }
    setCourses(courseMap); // Set courses for each batch
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchBatches();
  }, []);

  const toggleBatch = (batchId) => {
    setExpandedBatches((prev) => ({
      ...prev,
      [batchId]: !prev[batchId],
    }));
  };

  if (loading) return <div className="m-0">
    <Sidebar open={open} setOpen={setOpen} />
    <div
      className={`transition-all duration-300 ${open ? 'md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[75%]' : 'ml-24 mr-2'
        } md:w-[90%]  w-[95%] md:mt`}
    >
      <Loading/>
    </div></div>;

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className={`transition-all duration-300 ${open ? 'md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[75%]' : 'ml-24 mr-2'
          } md:w-[90%]  w-[95%] md:mt`}
      >
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">
              Teacher Dashboard
            </h1>
            {/* Displaying all batches and corresponding courses */}
            {batches.length > 0 ? (
              batches.map((batch) => {
                // Default to expanded if not explicitly collapsed
                const isExpanded = expandedBatches[batch.batch_id] !== false;
                return (
                  <div
                    key={batch.batch_id}
                    className="mb-6  p-4 rounded-lg shadow-md bg-white dark:bg-gray-800"
                  >
                    <div className="flex justify-between border rounded-lg items-center px-2">
                      <h2 className="text-2xl font-semibold text-primary-purple  p-2 rounded-lg">
                        {batch.batch_name}
                      </h2>
                      <button
                        onClick={() => toggleBatch(batch.batch_id)}
                        className="p-2 focus:outline-none bg-primary-purple/50 rounded-xl"
                        aria-label="Toggle batch data"
                      >
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                    {isExpanded && (
                      <>
                        {courses[batch.batch_id] && courses[batch.batch_id].length > 0 ? (
                          <ol className="list-decimal ml-8 mt-4">
                            {courses[batch.batch_id].map((course) => (
                              <li
                                key={course.course_id}
                                className="text-lg text-gray-700 dark:text-gray-300"
                              >
                                {course.course_name}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="text-gray-500 mt-4">No courses available for this batch.</p>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-primary-purple dark:text-accent-skyblue">
                No batches found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacher;

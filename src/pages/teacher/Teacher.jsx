import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Sidebar from "../../components/Sidebar";
import { getAllBatches, getCoursesByBatchId } from "../../api/auth";
import { getAllTests } from "../../api/test";
import { BookOpen, Users, Calendar, DollarSign, X } from "lucide-react";
import Loading from "../../components/Loading";

const Teacher = () => {
  const [open, setOpen] = useState(false);
  const [batches, setBatches] = useState([]); // Store batches
  const [courses, setCourses] = useState({}); // Store courses for each batch
  const [loading, setLoading] = useState(false); // Store loading state
  const [error, setError] = useState(""); // Store error state
  const [expandedBatches, setExpandedBatches] = useState({}); // State to handle expanded batches
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  
  // Fetch all tests and organize by batch_id
  const fetchAllTests = async () => {
    try {
      setLoadingTests(true);
      const response = await getAllTests("COURSE_TEST");
      console.log("Fetched Tests:", response);
      if (response && response.success && Array.isArray(response.data)) {
        // Group tests by batch_id
        const testsByBatch = response.data.reduce((acc, test) => {
          const batchId = test.Course?.batch_id; // Access batch_id from nested Course object
          if (!batchId) {
            console.warn('Test missing batch_id:', test.test_id);
            return acc;
          }
          
          if (!acc[batchId]) {
            acc[batchId] = [];
          }
          acc[batchId].push(test);
          return acc;
        }, {});
        
        console.log('Tests by batch:', testsByBatch);
        setTests(testsByBatch);
      }
    } catch (err) {
      console.error('Error fetching tests:', err);
      setTests({});
    } finally {
      setLoadingTests(false);
    }
  };
  
  const openModal = (batch) => {
    setSelectedBatch(batch);
    setIsOpen(true);
  };
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [tests, setTests] = useState({}); // Store tests for each batch
  const [loadingTests, setLoadingTests] = useState(false); // Loading state for tests
  // Fetch batches
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await getAllBatches();
      console.log("Fetched Batches:", response);
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
        console.error(
          `Error fetching courses for batch ${batch.batch_id}:`,
          err
        );
        courseMap[batch.batch_id] = [];
      }
    }
    setCourses(courseMap); // Set courses for each batch
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchBatches();
      await fetchAllTests();
    };
    fetchInitialData();
  }, []);

  const toggleBatch = (batchId) => {
    setExpandedBatches((prev) => ({
      ...prev,
      [batchId]: !prev[batchId],
    }));
  };

  if (loading)
    return (
      <div className="m-0">
        <Sidebar open={open} setOpen={setOpen} />
        <div
          className={`transition-all mt-14 duration-300 ${
            open
              ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[70%]"
              : "ml-24 mr-2 md:w-[90%]  w-[95%]"
          }`}
        >
          <Loading />
        </div>
      </div>
    );

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className={`transition-all mt-14 duration-300 ${
          open
            ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[70%]"
            : "ml-24 mr-2 md:w-[90%]  w-[95%]"
        }`}
      >
        <div className=" py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-extrabold text-primary-purple mb-2">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your batches and courses
              </p>
            </div>

            {/* Batches Grid */}
            {batches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map((batch) => (
                  <div
                    key={batch.batch_id}
                    onClick={() => openModal(batch)}
                    className="bg-white flex flex-col justify-center items-center dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={batch.banner}
                      className="w-48 h-48 object-cover pt-6 "
                      alt="Batch Image"
                    />
                    <div className="p-6 w-full">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {batch.batch_name}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-base font-medium bg-primary-purple/10 text-primary-purple">
                        <span>₹{batch.cost || "N/A"}</span>
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="h-4 w-4 mr-2 text-primary-purple" />
                          <span>
                            {new Date(batch.start_date).toLocaleDateString()} -{" "}
                            {new Date(batch.end_date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <BookOpen className="h-4 w-4 mr-2 text-primary-purple" />
                          <span className="mr-4">
                            {courses[batch.batch_id]?.length || 0} courses
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>
                            {tests[batch.batch_id]?.length || 0} tests
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(batch);
                          }}
                          className="w-full py-2 px-4 bg-primary-purple text-white rounded-lg hover:bg-primary-purple/90 transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 text-gray-400">
                  <Users className="w-full h-full" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                  No batches found
                </h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Get started by creating a new batch
                </p>
              </div>
            )}

            {/* Course Details Modal */}
            <Transition appear show={isOpen} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                        <div className="flex justify-between items-center">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                          >
                            {selectedBatch?.batch_name} - Courses
                          </Dialog.Title>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={closeModal}
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>

                        <div className="mt-4">
                          {selectedBatch &&
                          courses[selectedBatch.batch_id]?.length > 0 ? (
                            <ul className="space-y-3">
                              {courses[selectedBatch.batch_id].map((course) => (
                                <li
                                  key={course.course_id}
                                  className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                                >
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-purple/10 flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-primary-purple" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {course.course_name}
                                    </p>
                                    {course.description && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {course.description.length > 100
                                          ? `${course.description.substring(
                                              0,
                                              100
                                            )}...`
                                          : course.description}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-center py-4 mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <BookOpen className="mx-auto h-8 w-8 text-gray-400" />
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                No courses in this batch
                              </p>
                            </div>
                          )}

                          {/* Tests Section */}
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 mt-6">Tests</h4>
                          {loadingTests ? (
                            <div className="flex justify-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-purple"></div>
                            </div>
                          ) : selectedBatch && tests[selectedBatch.batch_id]?.length > 0 ? (
                            <ul className="space-y-3">
                              {tests[selectedBatch.batch_id].map((test) => (
                                <li key={test.test_id} className="flex items-start p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {test.title}
                                    </p>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                                      <p>Starts: {new Date(test.schedule_start).toLocaleString()}</p>
                                      <p>Ends: {new Date(test.schedule_end).toLocaleString()}</p>
                                      <p>Duration: {test.duration} minutes</p>
                                      <p>Total Marks: {test.total_marks}</p>
                                      <p>Questions: {test.questions_count}</p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-center py-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                No tests scheduled for this batch
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-6">
                          <button
                            type="button"
                            className="w-full px-4 py-2 text-sm font-medium text-primary-purple bg-primary-purple/10 rounded-md hover:bg-primary-purple/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple focus-visible:ring-offset-2"
                            onClick={closeModal}
                          >
                            Close
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teacher;

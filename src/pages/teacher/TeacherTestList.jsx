import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Eye, Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";
import { getAllBatches, getCoursesByBatchId } from "../../api/auth";
import { getAllTests } from "../../api/test";
import { Dialog, DialogTitle } from "@headlessui/react";

const TeacherTestList = () => {
  const [tests, setTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [filteredTests, setFilteredTests] = useState([]); // State to hold filtered tests
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Fetch tests on mount
  useEffect(() => {
    async function fetchTests() {
      try {
        const response = await getAllTests("COURSE_TEST");
        console.log("Tests:", response.data);
        setTests(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load tests");
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  // Fetch batches on mount
  useEffect(() => {
    async function fetchBatches() {
      try {
        const response = await getAllBatches();
        console.log("Batches:", response);

        if (response.success && Array.isArray(response.data)) {
          setBatches(response.data); // Set the batches
        } else {
          setBatches([]); // Empty array if no batches found
        }
      } catch (error) {
        toast.error("Failed to load batches");
        setLoading(false);
      }
    }
    fetchBatches();
  }, []);

  // Fetch courses when batch is selected
  useEffect(() => {
    if (selectedBatchId) {
      async function fetchCourses() {
        try {
          const response = await getCoursesByBatchId(selectedBatchId);
          if (Array.isArray(response.data)) {
            setCourses(response.data);
          } else {
            setCourses([]);
          }
        } catch (error) {
          toast.error("Failed to load courses");
        }
      }
      fetchCourses();
    }
  }, [selectedBatchId]);

  // Filter tests based on selected course
  useEffect(() => {
    if (selectedCourseId) {
      const filtered = tests.filter(
        (test) => test.course_id === selectedCourseId
      );
      setFilteredTests(filtered);
    } else {
      setFilteredTests(tests); // If no course selected, show all tests
    }
  }, [selectedCourseId, tests]);

  if (loading) return <Loading />;

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className={`transition-all mt-14 pt-6 duration-300 ${
          open
            ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[70%]"
            : "ml-24 mr-2 md:w-[90%]  w-[95%]"
        }`}
      >
        <div className="p-6  flex justify-center min-h-[90vh]">
          <Toaster />
          <div className="w-full max-w-5xl">
            <Dialog
              as="div"
              className="fixed z-10 bg-black/80 inset-0 overflow-y-auto"
              onClose={() => setShowDialog(false)}
              open={showDialog}
            >
              <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                  <DialogTitle
                    as="h3"
                    className="text-xl text-center leading-6 font-medium text-gray-900 px-4 py-2"
                  >
                    Create Test
                  </DialogTitle>

                  <div className="bg-gray-50  px-4 py-5 sm:p-6">
                    <div className="flex  gap-4 mb-4">
                      {/* Batch Dropdown */}
                      <select
                        value={selectedBatchId}
                        onChange={(e) => setSelectedBatchId(e.target.value)}
                        className="border w-full border-gray-300 rounded px-4 py-2"
                      >
                        <option value="">Select Batch</option>
                        {batches.map((batch) => (
                          <option key={batch.batch_id} value={batch.batch_id}>
                            {batch.batch_name}
                          </option>
                        ))}
                      </select>

                      {/* Course Dropdown */}
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="border w-full border-gray-300 rounded px-4 py-2"
                        disabled={!selectedBatchId}
                      >
                        <option value="">Select Course</option>
                        {courses.map((course) => (
                          <option
                            key={course.course_id}
                            value={course.course_id}
                          >
                            {course.course_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Create Test Link */}
                    <a
                      onClick={(e) => {
                        // Validate if batch is selected
                        if (!selectedBatchId) {
                          e.preventDefault(); // Prevent navigation
                          toast.error(
                            "Please select a batch before creating the test."
                          );
                          return;
                        }

                        // Validate if course is selected
                        if (!selectedCourseId) {
                          e.preventDefault(); // Prevent navigation
                          toast.error(
                            "Please select a course before creating the test."
                          );
                          return;
                        }
                      }}
                      className="flex justify-center no-underline hover:no-underline items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
                      href={`/createtest?type=COURSE_TEST&course_id=${selectedCourseId}&batch_id=${selectedBatchId}`}
                    >
                      Create Test <Plus />
                    </a>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setShowDialog(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </Dialog>
            <div className="flex justify-between mt-4">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">All tests</h1>
              </div>
              <button
                type="button"
                className="flex justify-center no-underline hover:no-underline items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
                onClick={() => setShowDialog(true)}
              >
                Create Test <Plus />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredTests.length > 0 ? (
                filteredTests.map((test) => (
                  <div
                    key={test.test_id}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-semibold mb-2">
                        {test.title}
                      </h2>
                      <button
                        onClick={() =>
                          window.open(
                            `/testpreview?test_id=${test.test_id}`,
                            "_blank"
                          )
                        }
                        className="flex justify-center items-center gap-2 px-3 py-1 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                        Watch Preview
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-10 font-bold">
                      <p className="text-gray-500 mb-1">
                        Start Date:{" "}
                        <span className="font-normal">
                          {new Date(test.schedule_start).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-gray-500 mb-1">
                        End Date:{" "}
                        <span className="font-normal">
                          {new Date(test.schedule_end).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-gray-500 mb-1">
                        Duration:{" "}
                        <span className="font-normal">
                          {test.duration} minutes
                        </span>
                      </p>
                      <p className="text-gray-600 mb-1">
                        Course:{" "}
                        <span className="font-normal">{test.course_name}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center pt-10 text-lg flex flex-col items-center text-primary-purple dark:text-accent-skyblue">
                  <img src="/Empty.png" className="w-1/3" alt="" />
                  No tests available for this course.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherTestList;

import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Eye, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";
import { getAllBatches, getCoursesByBatchId } from "../../api/auth";
import { getAllTests } from "../../api/test";
import { Dialog, DialogTitle } from "@headlessui/react";

const TeacherTestList = () => {
  const [searchParams] = useSearchParams();
  const urlBatchId = searchParams.get('batchId');
  const urlCourseId = searchParams.get('courseId');
  
  const [tests, setTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(urlBatchId || "");
  const [selectedCourseId, setSelectedCourseId] = useState(urlCourseId || "");
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  // Fetch tests on mount
  useEffect(() => {
    async function fetchTests() {
      try {
        const response = await getAllTests("COURSE_TEST");
        console.log("Response:", response)
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

  // Fetch courses when batch is selected or when URL has batchId
  useEffect(() => {
    const batchToUse = selectedBatchId || urlBatchId;
    
    if (batchToUse) {
      async function fetchCourses() {
        try {
          const response = await getCoursesByBatchId(batchToUse);
          if (Array.isArray(response.data)) {
            setCourses(response.data);
            
            // If URL has courseId, select it after courses are loaded
            if (urlCourseId && !selectedCourseId) {
              setSelectedCourseId(urlCourseId);
            }
          } else {
            setCourses([]);
          }
        } catch (error) {
          toast.error("Failed to load courses");
        }
      }
      fetchCourses();
    }
  }, [selectedBatchId, urlBatchId, urlCourseId, selectedCourseId]);

  // Filter tests based on selected course and batch
  useEffect(() => {
    let filtered = [...tests];
    
    // Apply course filter if selected
    if (selectedCourseId) {
      filtered = filtered.filter(test => test.course_id === selectedCourseId);
    }
    
    // Apply batch filter if selected (assuming tests might have batch_id in the future)
    if (selectedBatchId && !selectedCourseId) {
      // This assumes tests might have batch_id in the future
      // If not, we can remove this part or adjust based on your data structure
      filtered = filtered.filter(test => test.batch_id === selectedBatchId);
    }
    
    setFilteredTests(filtered);
  }, [selectedCourseId, selectedBatchId, tests]);

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
        <div className="p-6 flex justify-center min-h-[90vh]">
          <Toaster />
          <div className="w-full max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h1 className="text-3xl font-bold">All Tests</h1>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Batch Dropdown */}
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 w-full md:w-48"
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
                  className="border border-gray-300 rounded px-4 py-2 w-full md:w-48"
                  disabled={!selectedBatchId}
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>

                {/* Create Test Button */}
                <a
                  onClick={(e) => {
                    // Validate if batch is selected
                    if (!selectedBatchId) {
                      e.preventDefault();
                      toast.error("Please select a batch before creating the test.");
                      return;
                    }

                    // Validate if course is selected
                    if (!selectedCourseId) {
                      e.preventDefault();
                      toast.error("Please select a course before creating the test.");
                      return;
                    }
                  }}
                  className="flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-primary-purple text-white hover:bg-purple-700 transition-colors whitespace-nowrap"
                  href={`/createtest?type=COURSE_TEST&course_id=${selectedCourseId}&batch_id=${selectedBatchId}`}
                >
                  <Plus size={18} /> Create Test
                </a>
              </div>
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
                    <div className="grid grid-cols-3 gap-x-10 font-bold items-center">
                      <p className="text-gray-500 m-0">
                        Start Date:{" "}
                        <span className="font-normal">
                          {new Date(test.schedule_start).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-gray-500 m-0">
                        End Date:{" "}
                        <span className="font-normal">
                          {new Date(test.schedule_end).toLocaleString()}
                        </span>
                      </p>
                      <p className="text-gray-500 m-0">
                        Duration:{" "}
                        <span className="font-normal">
                          {test.duration} minutes
                        </span>
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

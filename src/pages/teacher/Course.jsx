import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import {
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByBatchId,
  getAllBatches,
} from "../../api/auth";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const Course = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [courseImage, setCourseImage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState(batchId || "");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // First, fetch all batches to check if the batchId is valid
        const batchesResponse = await getAllBatches();

        if (batchesResponse?.success && Array.isArray(batchesResponse.data)) {
          setBatches(batchesResponse.data);

          // Check if the batchId is valid
          const isValidBatch =
            batchId && batchesResponse.data.some((b) => b.batch_id === batchId);

          if (isValidBatch) {
            // If batch is valid, only fetch courses for that batch
            setSelectedBatchFilter(batchId);
            const batch = batchesResponse.data.find(
              (b) => b.batch_id === batchId
            );
            await fetchCoursesForBatches([batch]);
          } else {
            // If batch is invalid or not provided, fetch all courses
            setSelectedBatchFilter("");
            await fetchCoursesForBatches(batchesResponse.data);
          }
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [batchId]); // Only depend on batchId

  // Removed the old fetchBatches function as its logic is now in the useEffect

  const fetchCoursesForBatches = async (batchList) => {
    const courseMap = {};
    // Ensure batchList is iterable
    for (const batch of batchList) {
      try {
        const courseData = await getCoursesByBatchId(batch.batch_id);
        console.log(`Courses for batch ${batch.batch_id}:`, courseData);
        // Ensure we're storing the data.data array, not the entire response
        courseMap[batch.batch_id] = courseData.success ? courseData.data : [];
      } catch (err) {
        console.error(
          `Error fetching courses for batch ${batch.batch_id}:`,
          err
        );
        courseMap[batch.batch_id] = [];
      }
    }
    setCourses(courseMap);
  };

  const handleCreateCourse = async () => {
    // Validation for course name and batch selection
    if (!newCourseName.trim()) {
      toast.error("Course name is required.");
      return;
    }
    if (!selectedBatchId) {
      toast.error("Please select a batch.");
      return;
    }

    try {
      setLoading(true);
      const courseData = {
        batch_id: selectedBatchId,
        course_name: newCourseName,
        allow_notes_download: true, // Ensure this field is always included
      };
      await createCourse(courseData);
      setNewCourseName("");
      setSelectedBatchId("");
      setIsDialogOpen(false);
      toast.success("Course created successfully!");
      fetchBatches();
    } catch (err) {
      setError(err.message);
      toast.error("Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (courseId) => {
    const updatedName = prompt("Enter new course name:");
    if (!updatedName) return;
    try {
      setLoading(true);
      await updateCourse(courseId, { course_name: updatedName });
      fetchBatches();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      setLoading(true);
      await deleteCourse(courseId);
      fetchBatches();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchFilterChange = (e) => {
    const batchId = e.target.value;
    setSelectedBatchFilter(batchId);
    // Update URL when batch filter changes
    if (batchId) {
      navigate(`/courses/${batchId}`, { replace: true });
    } else {
      navigate("/courses", { replace: true });
    }
  };

  return (
    <div className="m-0">
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className={`transition-all mt-14 pt-8 duration-300 ${
          open
            ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[70%]"
            : "ml-24 mr-2 md:w-[90%]  w-[95%]"
        }`}
      >
        <div className="p-6  dark:bg-gray-900 flex justify-center min-h-screen ">
          <div className="w-full ">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Course Management</h1>
                <div className="flex gap-2">
                  <select
                    id="batchFilter"
                    value={selectedBatchFilter}
                    onChange={handleBatchFilterChange}
                    className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                  >
                    <option value="">All Batches</option>
                    {batches.map((batch) => (
                      <option key={batch.batch_id} value={batch.batch_id}>
                        {batch.batch_name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2 bg-primary-purple text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    <Plus size={20} />
                    Create New Course
                  </button>
                </div>
              </div>
            </div>

            {/* Course Creation Dialog */}
            <Transition show={isDialogOpen} as={React.Fragment}>
              <Dialog
                as="div"
                className="relative z-50"
                onClose={() => setIsDialogOpen(false)}
              >
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4">
                    <Transition.Child
                      as={React.Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                        <div className="flex justify-between items-center mb-4">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                          >
                            Create New Course
                          </Dialog.Title>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Course Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter course name"
                              value={newCourseName}
                              onChange={(e) => setNewCourseName(e.target.value)}
                              className="border border-gray-300 dark:border-gray-600 p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Select Batch
                            </label>
                            <select
                              value={selectedBatchId}
                              onChange={(e) =>
                                setSelectedBatchId(e.target.value)
                              }
                              className="border border-gray-300 dark:border-gray-600 p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                            >
                              <option value="">Select Batch</option>
                              {batches.map((batch) => (
                                <option
                                  key={batch.batch_id}
                                  value={batch.batch_id}
                                >
                                  {batch.batch_name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mt-4 flex justify-end space-x-3">
                            <button
                              type="button"
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                              onClick={() => {
                                setIsDialogOpen(false);
                                setNewCourseName("");
                                setSelectedBatchId("");
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleCreateCourse}
                              className="px-4 py-2 text-sm font-medium text-white bg-primary-purple hover:bg-opacity-90 rounded-md flex items-center"
                              disabled={
                                loading ||
                                !newCourseName.trim() ||
                                !selectedBatchId
                              }
                            >
                              {loading ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Creating...
                                </>
                              ) : (
                                "Create Course"
                              )}
                            </button>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>

            {/* Display Batches & Courses */}
            <div className="mt-4 space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-t-primary-purple border-secondary-gray rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading courses...
                  </p>
                </div>
              ) : Object.entries(courses).length > 0 ? (
                // If we have a valid batchId in the URL, show courses for that batch only
                batchId && batches.some((b) => b.batch_id === batchId) ? (
                  <div className="space-y-2 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-primary-purple">
                        {batches.find((b) => b.batch_id === batchId)
                          ?.batch_name || "Courses"}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {courses[batchId]?.map((course) => (
                        <CourseCard
                          key={course.course_id}
                          course={course}
                          onEdit={handleUpdateCourse}
                          onDelete={handleDeleteCourse}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  // Show all courses grouped by batch
                  Object.entries(courses)
                    .filter(([_, courseList]) => courseList.length > 0)
                    .map(([batchId, courseList]) => {
                      const batch = batches.find((b) => b.batch_id === batchId);
                      return (
                        <div
                          key={batchId}
                          className="space-y-2 border border-primary-purple p-4 rounded-lg "
                        >
                          <div className=" ">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                              {batch?.batch_name || "Unknown Batch"}
                            </h2>
                            {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {batch?.description || ''}
                                                        </p> */}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-0">
                            {courseList.map((course) => (
                              <CourseCard
                                key={course.course_id}
                                course={course}
                                onEdit={handleUpdateCourse}
                                onDelete={handleDeleteCourse}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No courses found. Create a new course to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Course Card Component
const CourseCard = ({ course, onEdit, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
          {course.course_name}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {course.description || "No description available"}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(course.course_id);
          }}
          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          title="Edit course"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (
              window.confirm("Are you sure you want to delete this course?")
            ) {
              onDelete(course.course_id);
            }
          }}
          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          title="Delete course"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>
);

export default Course;

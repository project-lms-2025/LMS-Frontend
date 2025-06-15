import { useEffect, useState } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import {
    createCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCoursesByBatchId,
    getAllBatches
} from "../../api/auth";
import Sidebar from "../../components/Sidebar";
import toast from "react-hot-toast";

const Course = () => {
    const [open, setOpen] = useState(false);
    const [batches, setBatches] = useState([]);
    const [courses, setCourses] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newCourseName, setNewCourseName] = useState("");
    const [selectedBatchId, setSelectedBatchId] = useState("");
    const [courseImage, setCourseImage] = useState(null);
    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const response = await getAllBatches();
            console.log("Batch response:", response);
            // Expecting response to have a data property which is an array.
            if (response && response.success && Array.isArray(response.data)) {
                setBatches(response.data);
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
                console.error(`Error fetching courses for batch ${batch.batch_id}:`, err);
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
                allow_notes_download: true // Ensure this field is always included
            };
            await createCourse(courseData);
            setNewCourseName("");
            setSelectedBatchId("");
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

    return (
        <div className="m-0">
            <Sidebar open={open} setOpen={setOpen} />
            <div
                className={`transition-all mt-14 pt-12 duration-300 ${open ? 'md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[70%]' : 'ml-24 mr-2'
                    } md:w-[90%]  w-[95%]`}
            >
                <div className="p-6  dark:bg-gray-900 flex justify-center min-h-screen ">
                    <div className="w-[40rem]">
                        <h1 className="text-3xl font-bold mb-6">Course Management</h1>
                        {loading && <p className="text-primary-purple">Loading...</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {/* Course Creation Section */}
                        <div className="border border-gray-300 dark:border-gray-600 p-4 my-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Create Course</h3>
                            <input
                                type="text"
                                placeholder="Enter course name"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                                className="border border-gray-300 dark:border-gray-600 p-2 my-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                            />
                            <select
                                onChange={(e) => setSelectedBatchId(e.target.value)}
                                className="border border-gray-300 dark:border-gray-600 p-2 my-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded"
                            >
                                <option value="">Select Batch</option>
                                {batches.map((batch) => (
                                    <option key={batch.batch_id} value={batch.batch_id}>
                                        {batch.batch_name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleCreateCourse}
                                className="flex items-center justify-center bg-primary-purple text-white px-4 py-2 rounded transition-all hover:bg-purple-700"
                                disabled={loading || !newCourseName.trim() || !selectedBatchId} // Disable if validation fails
                            >
                                <PlusCircle size={18} className="mr-2" /> Create Course
                            </button>
                        </div>


                        {/* Display Batches & Courses */}
                        <div className="mt-4">
                            {batches.length > 0 ? (
                                batches.map((batch) => (
                                    <div key={batch.batch_id} className="border border-gray-300 dark:border-gray-600 p-4 my-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold text-primary-purple">{batch.batch_name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{batch.description}</p>
                                        {/* Show teacher_email only if it exists */}
                                        {batch.teacher_email && (
                                            <p className="text-sm text-gray-500 dark:text-gray-300">Teacher: {batch.teacher_email}</p>
                                        )}
                                        <h4 className="mt-1 text-md font-semibold text-gray-800 dark:text-white">Courses:</h4>
                                        <ul>
                                            {courses[batch.batch_id] && courses[batch.batch_id].length > 0 ? (
                                                courses[batch.batch_id].map((course) => (
                                                    <li key={course.course_id} className="border border-gray-300 dark:border-gray-600 p-3 my-2 flex justify-between items-center rounded-lg bg-secondary-gray dark:bg-gray-700">
                                                        <div className="">
                                                            <h1 className="text-gray-900 text-xl dark:text-white">
                                                                {course.course_name}
                                                            </h1>
                                                            <h1 className="text-sm text-gray-500 dark:text-gray-300">(ID: {course.course_id})</h1>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleUpdateCourse(course.course_id)}
                                                                className="bg-yellow-500 text-white px-3 py-1 rounded transition-all hover:bg-yellow-600 flex items-center"
                                                            >
                                                                <Edit size={16} className="mr-1" /> Update
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCourse(course.course_id)}
                                                                className="bg-red-500 text-white px-3 py-1 rounded transition-all hover:bg-red-600 flex items-center"
                                                            >
                                                                <Trash2 size={16} className="mr-1" /> Delete
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 dark:text-gray-300">No courses available</p>
                                            )}
                                        </ul>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-300">No batches available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Course;

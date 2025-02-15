import { useEffect, useState } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { createCourse, getCourseById, updateCourse, deleteCourse, getCoursesByBatchId, getAllBatches } from "../api/auth";

const Course = () => {
    const [batches, setBatches] = useState([]);
    const [courses, setCourses] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newCourseName, setNewCourseName] = useState("");
    const [selectedBatchId, setSelectedBatchId] = useState("");

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const batchData = await getAllBatches();
            setBatches(batchData);
            fetchCoursesForBatches(batchData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCoursesForBatches = async (batchList) => {
        const courseMap = {};
        for (const batch of batchList) {
            try {
                const courseData = await getCoursesByBatchId(batch.batch_id);
                console.log(courseData)
                courseMap[batch.batch_id] = courseData;
            } catch (err) {
                console.error(`Error fetching courses for batch ${batch.batch_id}:`, err);
            }
        }
        setCourses(courseMap);
    };

    const handleCreateCourse = async () => {
        if (!newCourseName || !selectedBatchId) {
            alert("Please enter course name and select a batch.");
            return;
        }
        try {
            setLoading(true);
            console.log(selectedBatchId, "\n", newCourseName);
            const courseData = {
                batch_id: selectedBatchId,
                course_name: newCourseName,
                allow_notes_download: true // Ensure this field is always included
            };
            await createCourse(courseData);
            setNewCourseName("");
            fetchBatches();
        } catch (err) {
            setError(err.message);
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
        <div className={`min-h-screen px-6 bg-secondary-gray dark:bg-gray-900 transition-all`}>
            

            {loading && <p className="text-primary-purple">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <h2 className="text-2xl font-bold text-primary-purple mb-4">Course Management</h2>
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
                            <p className="text-sm text-gray-500 dark:text-gray-300">Teacher: {batch.teacher_email}</p>

                            <h4 className="mt-3 text-md font-semibold text-gray-800 dark:text-white">Courses:</h4>
                            <ul>
                                {courses[batch.batch_id]?.length > 0 ? (
                                    courses[batch.batch_id].map((course) => (
                                        <li key={course.course_id} className="border border-gray-300 dark:border-gray-600 p-3 my-2 flex justify-between items-center rounded-lg bg-secondary-gray dark:bg-gray-700">
                                            <span className="text-gray-900 dark:text-white">
                                                {course.course_name} <span className="text-sm text-gray-500 dark:text-gray-300">(ID: {course.course_id})</span>
                                            </span>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => alert("Update course functionality here")}
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
    );
};

export default Course;


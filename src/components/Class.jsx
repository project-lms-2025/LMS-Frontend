import { useEffect, useState } from "react";
import { createClass, deleteClass, getClassesByCourseId, updateClass } from "../api/auth";
import { getAllBatches, getCoursesByBatchId } from "../api/auth"; // Import batch and course APIs
import {Pencil, Trash2, Video} from "lucide-react";

const Class = () => {
    const [batches, setBatches] = useState([]);
    const [courses, setCourses] = useState({});
    const [selectedBatchId, setSelectedBatchId] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState({
        class_title: "",
        class_date_time: "",
        recording_url: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const authToken = localStorage.getItem("authToken"); // Retrieve token

    // Fetch batches on component mount
    useEffect(() => {
        fetchBatches();
    }, []);

    // Fetch courses when batch is selected
    useEffect(() => {
        if (selectedBatchId) {
            fetchCoursesForBatch(selectedBatchId);
        }
    }, [selectedBatchId]);

    // Fetch classes when course is selected
    useEffect(() => {
        if (selectedCourseId) {
            fetchClassesByCourse();
        }
    }, [selectedCourseId]);

    // Fetch all batches
    const fetchBatches = async () => {
        try {
            setLoading(true);
            const batchData = await getAllBatches();
            setBatches(batchData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch courses for selected batch
    const fetchCoursesForBatch = async (batchId) => {
        try {
            const courseData = await getCoursesByBatchId(batchId);
            setCourses((prev) => ({ ...prev, [batchId]: courseData }));
        } catch (err) {
            console.error(`Error fetching courses for batch ${batchId}:`, err);
        }
    };

    // Fetch classes by course
    const fetchClassesByCourse = async () => {
        try {
            setLoading(true);
            const data = await getClassesByCourseId(selectedCourseId);
            console.log("Fetched Classes:", data);
            setClasses(data);
        } catch (err) {
            console.error("fetchClassesByCourse Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    // Create a new class
    const handleCreateClass = async () => {
        if (!selectedCourseId || !newClass.class_title || !newClass.class_date_time) {
            alert("Please fill all fields");
            return;
        }
        try {
            setLoading(true);
            const classData = { ...newClass, course_id: selectedCourseId };
            await createClass(classData, authToken);
            setNewClass({ class_title: "", class_date_time: "", recording_url: "" });
            fetchClassesByCourse();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Update class title
    const handleUpdateClass = async (classId) => {
        const updatedTitle = prompt("Enter new class title:");
        if (!updatedTitle) return;

        try {
            setLoading(true);
            await updateClass(classId, { class_title: updatedTitle }, authToken);
            fetchClassesByCourse();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClass = async (classId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this class?");
        if (!confirmDelete) return;

        try {
            const authToken = localStorage.getItem("authToken"); // Ensure token is available
            await deleteClass(classId, authToken);
            alert("Class deleted successfully");
            fetchClassesByCourse(); // Refresh class list after deletion
        } catch (error) {
            console.error("Error deleting class:", error);
            alert("Failed to delete class: " + error.message);
        }
    };


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Class Management</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Batch Selection */}
            <div className="border p-4 my-4">
                <h3 className="text-lg font-semibold">Select Batch</h3>
                <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="border p-2 w-full"
                >
                    <option value="">Select a batch</option>
                    {batches.map((batch) => (
                        <option key={batch.batch_id} value={batch.batch_id}>
                            {batch.batch_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Course Selection */}
            {selectedBatchId && (
                <div className="border p-4 my-4">
                    <h3 className="text-lg font-semibold">Select Course</h3>
                    <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="border p-2 w-full"
                    >
                        <option value="">Select a course</option>
                        {courses[selectedBatchId]?.map((course) => (
                            <option key={course.course_id} value={course.course_id}>
                                {course.course_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Class Creation */}
            {selectedCourseId && (
                <div className="border p-4 my-4">
                    <h3 className="text-lg font-semibold">Create Class</h3>
                    <input
                        type="text"
                        placeholder="Enter class title"
                        value={newClass.class_title}
                        onChange={(e) => setNewClass({ ...newClass, class_title: e.target.value })}
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="datetime-local"
                        value={newClass.class_date_time}
                        onChange={(e) => setNewClass({ ...newClass, class_date_time: e.target.value })}
                        className="border p-2 my-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Enter recording URL (optional)"
                        value={newClass.recording_url}
                        onChange={(e) => setNewClass({ ...newClass, recording_url: e.target.value })}
                        className="border p-2 my-2 w-full"
                    />
                    <button
                        onClick={handleCreateClass}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Create Class
                    </button>
                </div>
            )}

            {/* Display Classes */}
            <div className="mt-6 space-y-4">
                {classes.length > 0 ? (
                    classes.map((cls) => (
                        <div
                            key={cls.class_id}
                            className=" flex justify-between items-centre border rounded-lg p-5 shadow-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                        >
                            {/* Class Title */}
                            <div className="">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cls.class_title}</h3>

                            {/* Date & Time */}
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                📅 {new Date(cls.class_date_time).toLocaleString()}
                            </p>

                            {/* Recording Link (If Available) */}
                            {cls.recording_url && (
                                <a
                                    href={cls.recording_url}
                                    className="text-blue-500 flex items-center mt-2 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Video size={18} className="mr-2" />
                                    View Recording
                                </a>
                            )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex  justify-center  space-x-3 mt-4">
                                <button
                                    onClick={() => handleUpdateClass(cls.class_id)}
                                    className=" bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                                >
                                    <Pencil size={16} />
                                   
                                </button>

                                <button
                                    onClick={() => handleDeleteClass(cls.class_id)}
                                    className=" bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No classes available</p>
                )}
            </div>
        </div>
    );
};

export default Class;

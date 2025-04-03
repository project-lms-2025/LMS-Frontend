import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Eye, Plus } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';
import { getAllBatches, getCoursesByBatchId } from '../../api/auth';
import { getAllTests } from '../../api/test';

const TeacherTestList = () => {
    const [tests, setTests] = useState([]);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedBatchId, setSelectedBatchId] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [filteredTests, setFilteredTests] = useState([]); // State to hold filtered tests
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // Fetch tests on mount
    useEffect(() => {
        async function fetchTests() {
            try {
                const data = await getAllTests("COURSE_TEST");
                console.log("Tests:", data);
                setTests(data);
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
                    setBatches(response.data);  // Set the batches
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
            const filtered = tests.filter(test => test.course_id === selectedCourseId);
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
                className={`transition-all duration-300 ${open ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[75%]" : "ml-24 mr-2"
                    } md:w-[90%] w-[95%]`}
            >
                <div className="p-6 flex justify-center min-h-[90vh]">
                    <Toaster />
                    <div className="w-full max-w-5xl">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-3xl font-bold">All tests</h1>
                            <div className="flex items-center gap-4">
                                {/* Batch Dropdown */}
                                <select
                                    value={selectedBatchId}
                                    onChange={(e) => setSelectedBatchId(e.target.value)}
                                    className="border border-gray-300 rounded px-4 py-2"
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
                                    className="border border-gray-300 rounded px-4 py-2"
                                    disabled={!selectedBatchId}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map((course) => (
                                        <option key={course.course_id} value={course.course_id}>
                                            {course.course_name}
                                        </option>
                                    ))}
                                </select>

                                {/* Create Test Link */}
                                <a
                                    onClick={(e) => {
                                        // Validate if batch is selected
                                        if (!selectedBatchId) {
                                            e.preventDefault(); // Prevent navigation
                                            toast.error("Please select a batch before creating the test.");
                                            return;
                                        }

                                        // Validate if course is selected
                                        if (!selectedCourseId) {
                                            e.preventDefault(); // Prevent navigation
                                            toast.error("Please select a course before creating the test.");
                                            return;
                                        }
                                    }}
                                    className="flex justify-center no-underline hover:no-underline items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
                                    href={`/createtest?type=COURSE_TEST&course_id=${selectedCourseId}`}
                                >
                                    Create Test <Plus />
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {filteredTests.length > 0 ? (
                                filteredTests.map((test) => (
                                    <div key={test.test_id} className="bg-white p-4 rounded-lg shadow">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-2xl font-semibold mb-2">{test.title}</h2>
                                            <button
                                                onClick={() =>
                                                    window.open(`/testpreview?test_id=${test.test_id}`, '_blank')
                                                }
                                                className="flex justify-center items-center gap-2 px-3 py-1 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Watch Preview
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-10 font-bold">
                                            <p className="text-gray-500 mb-1">
                                                Start Date: <span className="font-normal">{new Date(test.schedule_start).toLocaleString()}</span>
                                            </p>
                                            <p className="text-gray-500 mb-1">
                                                End Date: <span className="font-normal">{new Date(test.schedule_end).toLocaleString()}</span>
                                            </p>
                                            <p className="text-gray-500 mb-1">
                                                Duration: <span className="font-normal">{test.duration} minutes</span>
                                            </p>
                                            <p className="text-gray-600 mb-1">
                                                Course: <span className="font-normal">{test.course_name}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No tests available for this course.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherTestList;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { attemptedTest } from '../../api/test';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttempedTestList = () => {
    const [open, setOpen] = useState(false);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttemptedTests = async () => {
            try {
                const fetchedTests = await attemptedTest();
                setTests(fetchedTests);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch attempted tests');
                setLoading(false);
            }
        };

        fetchAttemptedTests();
    }, []);

    const handleViewTestDetails = (testId) => {
        navigate(`/test/${testId}`);
    };

    return (
        <div className='m-0'>
            <Sidebar open={open} setOpen={setOpen} />
            <ToastContainer />
            {/* Main content */}
            <div
                className={`transition-all duration-300 p-6 ${open ? "md:ml-[20rem] ml-56 mr-4 w-[40%] md:w-[75%]" : "ml-24 mr-2"} md:w-[90%] w-[95%]`}
            >
                <h1 className="text-2xl font-bold mb-6">Attempted Tests</h1>
                
                {loading ? (
                    <div className="text-center text-gray-500">Loading tests...</div>
                ) : tests.length === 0 ? (
                    <div className="text-center text-gray-500">No tests attempted yet</div>
                ) : (
                    <div className="grid gap-4">
                        {tests.map((test) => (
                            <div
                                key={test.test_id}
                                className="bg-white border rounded-lg shadow-md p-4 flex justify-between items-center"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold">{test.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        Scheduled: {new Date(test.schedule_date).toLocaleDateString()}
                                        {' '}at{' '}
                                        {test.schedule_time}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleViewTestDetails(test.test_id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <Eye className="w-5 h-5" />
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AttempedTestList;
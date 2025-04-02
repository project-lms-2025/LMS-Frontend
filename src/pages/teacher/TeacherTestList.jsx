import React, { useEffect, useState } from 'react';
import { getAllTests } from '../../api/test';
import { Toaster, toast } from 'react-hot-toast';
import { Eye, Plus, PlusSquare } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Loading from '../../components/Loading';

const TeacherTestList = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // Fetch tests when component mounts
    useEffect(() => {
        async function fetchTests() {
            try {
                const data = await getAllTests("COURSE_TEST");
                console.log(data)
                setTests(data);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to load tests");
                setLoading(false);
            }
        }
        fetchTests();
    }, []);

    if (loading) return <Loading/>;

    return (
        <div className='m-0' >
            <Sidebar open={open} setOpen={setOpen} />
            {/* Main content */}
            <div
                className={`transition-all duration-300 ${open ? "md:ml-[20rem] ml-56 mr-4  w-[40%] md:w-[75%]" : "ml-24 mr-2"} md:w-[90%]  w-[95%] md:mt `}
            >
                <div className="p-6  flex justify-center min-h-[90vh]">
                    <Toaster />
                    <div className="w-[45rem]">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-3xl font-bold ">Scheduled Tests</h1>
                            <a className="flex  justify-center items-center gap-2 px-3 p-1 rounded-lg bg-white border border-gray-300 hover:bg-gray-50" href="/createtest?type=COURSE_TEST">Create Test<Plus /> </a>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {tests.map((test) => (

                                <div key={test.test_id} className="bg-white p-4 rounded-lg shadow">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-semibold mb-2">{test.title}</h2>
                                        <button
                                            onClick={() =>
                                                window.open(`/testpreview?test_id=${test.test_id}`, '_blank')
                                            }
                                            className="flex  justify-center items-center gap-2 px-3 py-1 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Watch Preview
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-10 font-bold">
                                        {/* Adjust field names as necessary. Since "subject" isn’t provided in the backend, we show Course ID */}
                                        <p className="text-gray-600 mb-1">
                                            Course: <span className="font-normal">{test.course_name}</span>
                                        </p>
                                        <p className="text-gray-500 mb-1">
                                            Date: <span className="font-normal">{test.schedule_date}</span>
                                        </p>
                                        <p className="text-gray-500 mb-1">
                                            Time: <span className="font-normal">{test.schedule_time}pm</span>
                                        </p>
                                        <p className="text-gray-500">
                                            Duration: <span className="font-normal">{test.duration} minutes</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherTestList;

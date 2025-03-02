import React from 'react';

const dummyTests = [
    {
        id: 1,
        title: "Mathematics Quiz",
        subject: "Mathematics",
        date: "2025-03-05",
        time: "10:00 AM",
        duration: "1 hour",
    },
    {
        id: 2,
        title: "Science Test",
        subject: "Science",
        date: "2025-03-06",
        time: "11:00 AM",
        duration: "1.5 hours",
    },
    {
        id: 3,
        title: "History Exam",
        subject: "History",
        date: "2025-03-07",
        time: "09:00 AM",
        duration: "2 hours",
    },
    {
        id: 4,
        title: "English Assessment",
        subject: "English",
        date: "2025-03-08",
        time: "02:00 PM",
        duration: "1 hour",
    },
];

const TeacherTestList = () => {
    return (
        <div className="p-6 bg-gray-100 flex justify-center min-h-screen ">
            <div className="w-[40rem] ">
                <h1 className="text-3xl font-bold mb-6">Scheduled Tests</h1>
                <div className="grid grid-cols-1 gap-4">
                    {dummyTests.map((test) => (
                        <div key={test.id} className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-2">{test.title}</h2>
                            <div className="grid grid-cols-2 gap-x-10 font-bold">
                                <p className="text-gray-600 mb-1">Subject: <span className='font-normal' >{test.subject}</span> </p>
                                <p className="text-gray-500 mb-1">Date: <span className='font-normal' >{test.date}</span> </p>
                                <p className="text-gray-500 mb-1">Time: <span className='font-normal' >{test.time}</span> </p>
                                <p className="text-gray-500">Duration: <span className='font-normal' >{test.duration}</span> </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default TeacherTestList;

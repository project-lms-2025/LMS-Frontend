import React, { useState, useEffect } from 'react';
import { Clock, Eye, Edit2, Save, Plus, Cross, CircleX, CalculatorIcon, ChevronUp, ChevronDown } from 'lucide-react';
import Calculator from '../../components/Calculator';
import Draggable from 'react-draggable';
const Test = () => {
    // Sample test paper data for student test-taking.
    const [questionPaper, setQuestionPaper] = useState({
        title: 'Sample Test',
        description: 'This is a sample test for students.',
        duration: 1, // in minutes (for testing, use a short duration)
        scheduleDate: '2025-02-25',
        scheduleTime: '10:00',
        totalMarks: 3,
        questions: [
            {
                id: 1,
                type: 'MCQ',
                section: 'GA',
                text: 'What is the capital of France?',
                options: ['Berlin', 'Paris', 'Rome', 'Madrid'],
                correctAnswer: 1,
                studentAnswer: null,
                marks: 1,
                incorrectMarks: 0.33,
                status: 'Not Answered',
            },
            {
                id: 2,
                type: 'MSQ',
                section: 'Subject',
                text: 'Select the prime numbers:',
                options: ['2', '3', '4', '6'],
                correctAnswers: [0, 1],
                studentAnswers: [],
                marks: 1,
                incorrectMarks: 0,
                status: 'Not Answered',
            },
            {
                id: 3,
                type: 'NAT',
                section: 'GA',
                text: 'Solve: 2 + 2 = ?',
                correctAnswerText: '4',
                studentAnswer: '',
                marks: 1,
                incorrectMarks: 0,
                status: 'Not Answered',
            },
        ],
    });

    const [selectedSection, setSelectedSection] = useState("GA");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isPreview, setIsPreview] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false);
    // Timer (in seconds) from duration field
    const [timeLeft, setTimeLeft] = useState(questionPaper.duration * 60);
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the open/close state
    const togglePanel = () => {
        setIsOpen(!isOpen);
    };
    // Timer countdown effect
    useEffect(() => {
        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleSubmitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    // Format seconds into HH:MM:SS
    const formatTime = (secs) => {
        const h = String(Math.floor(secs / 3600)).padStart(2, '0');
        const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
        const s = String(secs % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    // Filter questions by selected section
    const filteredQuestions = questionPaper.questions.filter(
        (q) => q.section === selectedSection
    );

    // Update student's answer for an MCQ question
    const updateStudentAnswer = (id, value) => {
        setQuestionPaper((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q.id === id ? { ...q, studentAnswer: value, status: 'Answered' } : q
            ),
        }));
    };

    // Update student's answers for an MSQ question
    const updateStudentAnswers = (id, valueArray) => {
        setQuestionPaper((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q.id === id ? { ...q, studentAnswers: valueArray, status: 'Answered' } : q
            ),
        }));
    };

    // Update student's answer for NAT question
    const updateStudentAnswerText = (id, value) => {
        setQuestionPaper((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q.id === id ? { ...q, studentAnswer: value, status: 'Answered' } : q
            ),
        }));
    };

    const currentQuestion = filteredQuestions[currentQuestionIndex];

    const handleSubmitTest = () => {
        console.log('Test Submitted:', questionPaper);
        // Here you might send the test data to the backend.
    };

    return (
        <div className=" bg-gra00 p-4 ">
            {/* Main Content */}
            <div className="lg:flex lg:gap-4  p-0">
                {/* Left: Question Display (70%) */}

                {/* Test Details */}
                <div className="lg:w-[67%]">
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <div className="flex justify-between md:grid-cols-2 gap-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{questionPaper.title}</h1>
                                {/* <p className="text-gray-700 mt-2">{questionPaper.description}</p> */}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {/* <div className="flex items-center">
                            <Clock className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="text-gray-700">Duration: {questionPaper.duration} minutes</span>
                        </div> */}
                                {/* <div className="flex items-center">
                                    <span className="text-gray-700">
                                        Scheduled on: {questionPaper.scheduleDate} at {questionPaper.scheduleTime}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-700">Time Left: {formatTime(timeLeft)}</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between bg-white  border-t-[1px] border-black  py-1">
                        <h1>Section</h1>
                        <h1 className='font-bold' >Time Left: <span className='font-normal ' >1:19:54</span> </h1>
                    </div>
                    <div className="flex justify-between  border-t-[1px] border-b-[1px] border-black py-1 ">
                        <h1 className='font-bold text-orange-500 ' >Question Type</h1>
                        <div className="flex gap-2">
                            <h1 className='' >Marks for correct answer: <span className='font-semibold text-green-500 ' >1 </span> </h1>
                            <h1 className='' >Marks for incorrect answer: <span className='font-semibold text-red-500 ' >0.33</span> </h1>
                        </div>
                    </div>
                    {/* Section Selector */}
                    <div className="  border-b-[1px] border-black mb-4">
                        <div className="flex justify-between gap-4">
                            <div className='flex my-2 gap-2' >

                                <button
                                    onClick={() => {
                                        setSelectedSection("GA");
                                        setCurrentQuestionIndex(0);
                                    }}
                                    className={`px-4 py-2 rounded-xl  ${selectedSection === "GA"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700"
                                        }`}
                                >
                                    General Aptitude (GA)
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedSection("Subject");
                                        setCurrentQuestionIndex(0);
                                    }}
                                    className={`px-4 py-2 rounded-xl ${selectedSection === "Subject"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200 text-gray-700"
                                        }`}
                                >
                                    Subject-specific Section
                                </button>
                            </div>

                            {/* Add here button to popup calculator & user can drag do calculations */}
                            <button
                                onClick={() => setShowCalculator((prev) => !prev)}
                                className="px-4 py-2 rounded  text-orange-400"
                            >
                                <CalculatorIcon />
                            </button>

                        </div>
                    </div>
                    {currentQuestion ? (
                        <div className="bg-white rounded-lg h-[33rem] shadow px-4 py-2 ">
                            <div className="flex justify-between">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Question No. {currentQuestion.id}
                                </h2>


                            </div>
                            <p className="mb-4 text-gray-800 text-2xl">{currentQuestion.text}</p>
                            {currentQuestion.type === 'MCQ' && (
                                <div className="space-y-[2.35rem]">
                                    {currentQuestion.options.map((opt, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion.id}`}
                                                className="h-4 w-4"
                                                checked={currentQuestion.studentAnswer === idx}
                                                onChange={() =>
                                                    updateStudentAnswer(currentQuestion.id, idx)
                                                }
                                            />
                                            <span className="text-gray-700 text-xl">{opt}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {currentQuestion.type === 'MSQ' && (
                                <div className="space-y-[2rem]">
                                    {currentQuestion.options.map((opt, idx) => {
                                        const checked =
                                            currentQuestion.studentAnswers &&
                                            currentQuestion.studentAnswers.includes(idx);
                                        return (
                                            <div key={idx} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4"
                                                    checked={checked}
                                                    onChange={(e) => {
                                                        let current = currentQuestion.studentAnswers || [];
                                                        if (e.target.checked) {
                                                            current.push(idx);
                                                        } else {
                                                            current = current.filter((i) => i !== idx);
                                                        }
                                                        updateStudentAnswers(currentQuestion.id, current);
                                                    }}
                                                />
                                                <span className="text-gray-700 text-xl">{opt}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {currentQuestion.type === 'NAT' && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Answer
                                    </label>
                                    <input
                                        type="text"
                                        value={currentQuestion.studentAnswer || ""}
                                        onChange={(e) =>
                                            updateStudentAnswerText(currentQuestion.id, e.target.value)
                                        }
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your answer"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>No question available.</p>
                    )}
                </div>

                {/* Right: Question Navigation (scrollable horizontally) */}
                <div className="lg:w-[33%] w-[93%] fixed lg:right-0  bottom-5 bg-gray-300 lg:bg-white rounded-lg shadow p-2 lg:p-6">
                    {/* Chevron Toggle for Mobile */}
                    <div className="flex justify-around lg:hidden lg:mb-4">
                        <button onClick={togglePanel}>
                            {isOpen ? (
                                <ChevronDown className="text-blue-600 font-bold" size={28} />
                            ) : (
                                <ChevronUp className="text-blue-600 font-bold" size={28} />
                            )}
                        </button>
                    </div>

                    {/* Main Content */}
                    <div >
                        {/* Profile and Status */}
                        <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>

                        <div className="grid grid-cols-2 mb-2">
                            <img
                                className="w-40"
                                src="https://img.freepik.com/free-photo/handsome-young-cheerful-man-with-arms-crossed_171337-1073.jpg?t=st=1740684883~exp=1740688483~hmac=e341b2806af15396440b431d78a40c702cd6f73dcbd53cb2a02b9366fa7d41d2&w=1060"
                                alt="Profile"
                            />
                            <h1 className="font-bold">Deepak Yadav</h1>
                        </div>

                        {/* Status Legend */}
                        <div className="mb-4 border-y-2 border-black py-4">
                            <h3 className="text-md font-semibold">Status:</h3>
                            <div className="flex flex-wrap gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                    <span className="w-10 h-10 bg-gradient-to-b from-teal-500 to-green-700 clip-custom1 flex items-center justify-center text-white">
                                        {filteredQuestions.filter((q) => q.status === 'Answered').length}
                                    </span>
                                    <span className="text-sm">Answered</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-10 h-10 bg-gradient-to-b from-red-500 to-red-700 clip-custom2 flex items-center justify-center text-white">
                                        {filteredQuestions.filter((q) => q.status === 'Not Answered').length}
                                    </span>
                                    <span className="text-sm">Not Answered</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span className="flex items-center justify-center w-10 h-10 text-center rounded bg-purple-200 border border-purple-400">
                                        {filteredQuestions.filter((q) => !q.status || q.status === 'Not Visited').length}
                                    </span>
                                    <span className="text-sm">Not Visited</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span className="flex items-center justify-center w-10 h-10 text-center bg-violet-600 text-white rounded-full">
                                        {filteredQuestions.filter((q) => q.status === 'Marked for Review').length}
                                    </span>
                                    <span className="text-sm">Marked for Review</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span className="flex items-center justify-center w-10 h-10 text-center rounded-full bg-violet-600 text-white relative">
                                        {filteredQuestions.filter((q) => q.status === 'Answered and Marked for Review').length}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="4"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            className="w-7 h-7 font-bold text-green-500 absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4"
                                        >
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    </span>
                                    <span className="text-sm wrap">Answered & Marked for Review</span>
                                </div>
                            </div>
                        </div>

                        {/* Question Buttons */}
                        <h2 className="text-lg font-semibold mb-4">Questions</h2>
                        <div className="flex flex-nowrap gap-2 overflow-x-auto h-[14.3rem]">
                            {filteredQuestions.map((q, index) => {
                                let btnColor = 'bg-gray-200 text-gray-800';

                                return (
                                    <button
                                        key={index + 1}
                                        onClick={() => setCurrentQuestionIndex(index)}
                                        className={`w-10 h-10 rounded ${btnColor} hover:opacity-80`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer Information */}
                        <div className="bg-white rounded-lg shadow p-4 mt-4">
                            <div className="flex justify-between items-center">
                                <div className="text-gray-600">
                                    Total Questions: {filteredQuestions.length}
                                </div>
                                <div className="text-gray-600">Total Marks: {questionPaper.totalMarks}</div>
                            </div>
                        </div>
                        </div>

                        <div className="flex justify-between gap-4 mt-2">
                            <button
                                onClick={() => console.log(questionPaper)}
                                className="flex w-full justify-center items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Submit Test
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showCalculator && (
                <Draggable>
                    <div className="fixed top-32 right-0 bg-gray-400 text-white p-2 rounded-xl shadow-lg z-50 cursor-move">
                        <div className="flex justify-end ">
                            <button
                                onClick={() => setShowCalculator(false)}
                                className=" text-gray-200 p py-1 rounded"
                            >
                                <CircleX className='absolute top-8 right-6  text-white' />
                            </button>
                        </div>
                        <Calculator />
                    </div>
                </Draggable>
            )}

        </div>
    );
};

export default Test;

import React, { useState, useEffect } from 'react';
import { Clock, Eye, Edit2, Save, Plus, Cross, CircleX, CalculatorIcon, ChevronUp, ChevronDown } from 'lucide-react';
import Calculator from '../../components/Calculator';
import Draggable from 'react-draggable';
import { getTestById } from '../../api/test';
import { useLocation } from 'react-router-dom';
const TestPreview = () => {

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState("GA");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Sample test paper data for student test-taking.
  const [questionPaper, setQuestionPaper] = useState({});

  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const test_id = searchParams.get("test_id");

  useEffect(() => {
    async function fetchTest() {
      try {
        const response = await getTestById(test_id);
        const data = response.data;
        console.log(data)
        setTestData(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load test.");
        console.error("Error fetching test:", error);
        setLoading(false);
      }
    }
    fetchTest();
  }, [test_id]);

  const sectionLabels = {
    "GA": "General Aptitude",
    "Subject": "Subject Specific Question"
  };
  const sections = testData ? Array.from(new Set(testData.questions.map(q => q.section))) : [];

  const filteredQuestions = testData
    ? testData.questions.filter(q => q.section === selectedSection)
    : [];
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  // Helper to format seconds into HH:MM:SS
  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const [showCalculator, setShowCalculator] = useState(false);
  // Timer (in seconds) from duration field
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the open/close state
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className=" px-4 ">
      {/* Main Content */}
      <div className="lg:flex lg:gap-4 pt-[5.5rem] p-0">
        {/* Left: Question Display (70%) */}
        {/* Test Details */}
        <div className="lg:w-[67%]  ">
          <div className="bg-white rounded-lg shadow p-4 my-4 ">
            <div className="flex justify-between md:grid-cols-2 gap-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{testData?.title}</h1>
                <p className="text-gray-700 mt-2">{testData?.description}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-between bg-white  border-t-[1px] border-black  py-1">
            <h1 className='text-xl' >Section</h1>
            <h1 className='font-bold text-base' >Time Left: <span className='font-normal ' >{testData?.schedule_date} at {testData?.schedule_time}</span> </h1>
          </div>
          <div className="mb-4">
            <span>Duration: {testData?.duration} minutes</span>
          </div>
          <div className="flex justify-between  border-t-[1px] border-b-[1px] border-black py-1 ">
            <h1 className='font-bold text-orange-500 text-xl' >Question Type: {currentQuestion?.question_type}</h1>
            <div className="flex gap-2">
              <h1 className='text-xl' >Marks for correct answer: <span className='font-semibold text-green-500 ' > {currentQuestion?.positive_marks} </span> </h1>
              <h1 className='text-xl' >Marks for incorrect answer: <span className='font-semibold text-red-500 ' > {currentQuestion?.negative_marks}</span> </h1>
            </div>
          </div>
          {/* Section Selector */}
          <div className="my-4">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => {
                  setSelectedSection(section);
                  setCurrentQuestionIndex(0);
                }}
                className={`px-4 py-2 rounded mx-2 ${section === selectedSection ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                  }`}
              >
                {sectionLabels[section] || section}
              </button>
            ))}
          </div>

          {currentQuestion ? (
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4 h-[50vh] overflow-y-auto border">
              <h2 className="text-xl font-semibold mb-4">{currentQuestion.question_text}</h2>
              {currentQuestion.image_url && (
                <img
                  src={currentQuestion.image_url}
                  alt="Question Attachment"
                  className="mb-4 h-auto object-cover border rounded-xl"
                />
              )}
              {/* Render options based on question type */}
              {currentQuestion.question_type === "MCQ" && (
                <div>
                  {currentQuestion.options.map((opt, idx) => (
                    <div key={opt.option_id} className=" space-x-2 mb-2">
                      <input type="radio" name="mcq" />
                      <span>{opt.option_text}</span>
                      <div className="w-full flex justify-center items-center">
                        {opt.image_url && (
                          <img
                            src={opt.image_url}
                            alt={`Option ${idx} Attachment`}
                            className="w-1/4 object-cover"
                          />
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
              {currentQuestion.question_type === "MSQ" && (
                <div>
                  {currentQuestion.options.map((opt, idx) => (
                    <div key={opt.option_id} className="space-x-2 gap-2 mb-2">
                      <input type="checkbox" />
                      <span>{opt.option_text}</span>
                      <div className="w-full flex  items-center">
                        {opt.image_url && (
                          <img
                            src={opt.image_url}
                            alt={`Option ${idx} Attachment`}
                            className="border rounded-lg m-2 h-auto object-cover"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {currentQuestion.question_type === "NAT" && (
                <div className="mt-4">
                  <label className="block font-medium">Your Answer:</label>
                  <input
                    type="text"
                    defaultValue={currentQuestion.options[0]?.option_text || ""}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              )}
            </div>
          ) : (
            <p>No question available in this section.</p>
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
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
              <div className="flex flex-nowrap gap-2 overflow-x-auto h-[11rem]">
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
                  <div className="text-gray-600">Total Marks: {questionPaper.total_marks}</div>
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

export default TestPreview;

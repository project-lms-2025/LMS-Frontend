import React, { useState, useEffect } from 'react';
import { Clock, Eye, Edit2, Save, Plus, CalculatorIcon, ChevronUp, ChevronDown, CircleX, Paperclip } from 'lucide-react';
import Draggable from 'react-draggable';
import { getTestById, submitTest } from '../../api/test'; // Import API functions, including submitTest
import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import SuccessPopup from '../../components/SuccessPopup';
import Loading from '../../components/Loading';

const SubmitTest = () => {
  // States for test data and UI
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedSection, setSelectedSection] = useState("GA");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showOptions, setShowOptions] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { state } = useLocation();
  const { test_id } = state || {};

  // Fetch test data on mount using getTestById
  useEffect(() => {
    async function fetchTest() {
      try {
        // Fetch from backend
        const data = await getTestById(test_id);
        console.log(data.questions);

        // Restore or initialize timer
        const storedTimeLeft = sessionStorage.getItem("timeLeft");
        const initialTime = storedTimeLeft
          ? parseInt(storedTimeLeft, 10)
          : data.duration * 60;
        setTimeLeft(initialTime);

        // Restore saved answers
        const savedAnswers =
          JSON.parse(sessionStorage.getItem("studentAnswers") || "{}");

        // Apply saved answers to each question
        const updatedQuestions = data.questions.map((q) => {
          const saved = savedAnswers[q.question_id];
          if (saved !== undefined && saved !== null) {
            if (q.question_type === "MCQ") {
              // saved is an array, take first element
              q.studentAnswer = Array.isArray(saved) ? saved[0] : saved;
            } else if (q.question_type === "MSQ") {
              // ensure it's always an array
              q.studentAnswers = Array.isArray(saved) ? saved : [saved];
            } else if (q.question_type === "NAT") {
              q.response_text = saved;
            }
          }
          return q;
        });

        // Set state with questions prefilled
        setTestData({ ...data, questions: updatedQuestions });
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load test.");
        setLoading(false);
      }
    }

    if (test_id) {
      fetchTest();
    }
  }, [test_id]);



  // Save student answers to localStorage whenever they change
  const saveAnswersToSessionStorage = () => {
    if (!testData || !testData.questions) return;
    const answers = testData.questions.reduce((acc, q) => {
      // For MCQ (single selection)
      if (q.question_type === "MCQ") {
        acc[q.question_id] = [q.studentAnswer]; // Store a single option_id for MCQ
      }
      // For MSQ (multiple selections)
      else if (q.question_type === "MSQ") {
        acc[q.question_id] = q.studentAnswers || []; // Store multiple option_ids for MSQ
      }
      // For NAT (text entry)
      else if (q.question_type === "NAT") {
        acc[q.question_id] = q.response_text || ""; // Store text for NAT
      }
      return acc;
    }, {});

    // Store the answers object in localStorage
    sessionStorage.setItem("studentAnswers", JSON.stringify(answers));
    +    sessionStorage.setItem("timeLeft", timeLeft);
  };

  // UseEffect to detect changes in testData and store to localStorage after updates
  useEffect(() => {
    saveAnswersToSessionStorage();
  }, [testData, timeLeft]);

  // Extract sections and filter questions
  const sectionLabels = {
    "GA": "General Aptitude",
    "Subject": "Subject Specific Question"
  };
  const sections = testData ? Array.from(new Set(testData.questions.map(q => q.section))) : [];
  const filteredQuestions = testData ? testData.questions.filter(q => q.section === selectedSection) : [];
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prev => {
          const newTimeLeft = prev <= 1 ? 0 : prev - 1;
          sessionStorage.setItem("timeLeft", newTimeLeft); // Store time left in localStorage
          return newTimeLeft;
        });
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      handleSubmitTest(); // Automatically submit the test once time is up
    }
  }, [timeLeft]);


  // Helper to format time
  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Toggle panel for mobile view
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // ---------------------
  // Answer Capture Handlers
  // ---------------------
  // For MCQ: store the selected option id in studentAnswer
  const handleMCQAnswer = (questionId, optionId) => {
    setTestData(prevData => {
      const updatedQuestions = prevData.questions.map(q =>
        q.question_id === questionId ? { ...q, studentAnswer: optionId } : q
      );
      saveAnswersToSessionStorage(); // Save to localStorage
      return { ...prevData, questions: updatedQuestions };
    });
  };

  // For MSQ: store selected option ids in studentAnswers (array)
  const handleMSQAnswer = (questionId, optionId, checked) => {
    setTestData(prevData => {
      const updatedQuestions = prevData.questions.map(q => {
        if (q.question_id === questionId) {
          let answers = q.studentAnswers ? [...q.studentAnswers] : [];
          if (checked) {
            if (!answers.includes(optionId)) answers.push(optionId);
          } else {
            answers = answers.filter(a => a !== optionId);
          }
          return { ...q, studentAnswers: answers };
        }
        return q;
      });
      saveAnswersToSessionStorage(); // Save to localStorage
      return { ...prevData, questions: updatedQuestions };
    });
  };


  // For NAT: store the entered text in response_text
  const handleNATAnswer = (questionId, value) => {
    setTestData(prevData => {
      const updatedQuestions = prevData.questions.map(q =>
        q.question_id === questionId ? { ...q, response_text: value } : q
      );
      saveAnswersToSessionStorage(); // Save to localStorage
      return { ...prevData, questions: updatedQuestions };
    });
  };


  // Submit Functionality
  // Build responses array from testData and call the submitTest API.
  const handleSubmitTest = async () => {
    // Check if all questions have been answered
    if (!testData || !testData.questions) return;
    const unansweredQuestions = testData.questions.filter(q => {
      if (q.question_type === "MSQ") {
        return !q.studentAnswers || q.studentAnswers.length === 0;
      } else {
        return !q.studentAnswer;
      }
    });

    if (unansweredQuestions.length > 0) {
      const confirmation = window.confirm(
        "You have unanswered questions. Are you sure you want to submit the test?"
      );
      if (!confirmation) return;
    }

    // Build responses array from testData
    const responses = testData.questions.map(q => {
      if (q.question_type === "MSQ") {
        return {
          question_id: q.question_id,
          options_chosen: q.studentAnswers || [],
          response_text: q.response_text || ""
        };
      } else {
        return {
          question_id: q.question_id,
          options_chosen: q.studentAnswer ? [q.studentAnswer] : [],
          response_text: q.response_text || ""
        };
      }
    });

    try {
      console.log("Submitting responses:", responses);
      const result = await submitTest(testData.test_id, responses);
      toast.success("Test submitted successfully!");
      sessionStorage.removeItem("timeLeft"); // Clear the timer from localStorage after submission
      sessionStorage.removeItem("studentAnswers");
      setShowSuccess(true); // Show popup
    } catch (error) {
      toast.error("Error submitting test.");
      console.error("Submit test error:", error);
    }
  };

  if (loading) return <Loading />;
  if (!testData) return <div>No test data available.</div>;

  return (
    <div className=" px-4 ">
      <Toaster />
      {showSuccess && <SuccessPopup />}

      {/* Main Content */}
      <div className="lg:flex lg:gap-4  p-0">
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
          <div className=" flex justify-between items-center mt-2">
            <div className=" flex flex-col ">
              <span>Scheduled on: {testData.schedule_date} at {testData.schedule_time}</span>
              <span>Duration: {testData?.duration} minutes</span>
            </div>
            <div className="mt-2 text-xl font-bold">
              <span>Time Left: {formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="flex justify-between  border-t-[1px] border-b-[1px] border-black py-1 ">
            <h1 className='font-bold text-orange-500 text-xl' >Question Type: {currentQuestion?.question_type}</h1>
            <div className="flex gap-2">
              <h1 className='text-xl' >Marks for correct answer: <span className='font-semibold text-green-500 ' >{currentQuestion?.positive_marks} </span> </h1>
              <h1 className='text-xl' >Marks for incorrect answer: <span className='font-semibold text-red-500 ' >{currentQuestion?.negative_marks}</span> </h1>
            </div>
          </div>
          {/* Section Selector */}
          <div className="my-4 ">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => {
                  setSelectedSection(section);
                  setCurrentQuestionIndex(0);
                }}
                className={`px-4 py-2 rounded mx-2 ${section === selectedSection ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              >
                {sectionLabels[section] || section}
              </button>
            ))}
          </div>

          {/* Left: Question Panel */}
          {filteredQuestions.length > 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-4 mb-4 h-[53vh] overflow-y-auto border">
              <h2 className="text-xl font-semibold">Question No. {currentQuestionIndex + 1}</h2>
              <p className="mt-2">{currentQuestion.question_text}</p>
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
                    <div key={opt.option_id} className="fle w-full items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.question_id}`}
                        className="h-4 w-4 text-green-400"
                        checked={currentQuestion.studentAnswer === opt.option_id}
                        onChange={() => handleMCQAnswer(currentQuestion.question_id, opt.option_id)}
                        required
                      />
                      <span className='w-full ml-2 ' >{opt.option_text}</span>
                      <div className="w-full flex justify-cente items-center">
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
                  {currentQuestion.options.map((opt, idx) => {
                    const checked = currentQuestion.studentAnswers && currentQuestion.studentAnswers.includes(opt.option_id);
                    return (
                      <div key={opt.option_id} className="space-x-2 gap-2 mb-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={checked}
                          onChange={(e) => handleMSQAnswer(currentQuestion.question_id, opt.option_id, e.target.checked)}
                          required
                        />
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
                    );
                  })}
                </div>
              )}
              {currentQuestion.question_type === "NAT" && (
                <div className="mt-4">
                  <label className="block font-medium">Your Answer:</label>
                  <input
                    type="text"
                    value={currentQuestion.response_text || ""}
                    onChange={(e) => handleNATAnswer(currentQuestion.question_id, e.target.value)}
                    className="w-full border rounded px-2 py-1"
                    placeholder="Enter answer"
                    required
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
                <h1 className="font-bold text-xl">Deepak Yadav</h1>
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
                  {/* <div className="text-gray-600">Total Marks: {questionPaper?.totalMarks}</div> */}
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4 mt-2">
              <button
                onClick={handleSubmitTest}
                className="flex w-full justify-center items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* {showCalculator && (
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
      )} */}

    </div>
  );
};

export default SubmitTest;

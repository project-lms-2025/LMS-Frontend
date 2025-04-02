import React, { useState, useEffect } from 'react';
import { Clock, Eye, Edit2, Save, Plus, CalculatorIcon, ChevronUp, ChevronDown, CircleX, Paperclip } from 'lucide-react';
import Draggable from 'react-draggable';
import { getTestById, submitTest } from '../../api/test';
import { useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

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

  const { state } = useLocation();
  // const { test_id } = state || {};
  const test_id="e2133b8b-52c0-4dce-b719-d05187fdef65";

  // Fetch test data on mount using getTestById
  useEffect(() => {
    async function fetchTest() {
      try {
        const data = await getTestById(test_id);
        console.log(data);
        setTestData(data);
        setTimeLeft(data.duration * 60);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load test.");
        console.error("Error fetching test:", error);
        setLoading(false);
      }
    }
    if (test_id) fetchTest();
  }, [test_id]);

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
        setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
      return () => clearInterval(timerId);
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
    setTestData(prevData => ({
      ...prevData,
      questions: prevData.questions.map(q =>
        q.question_id === questionId ? { ...q, studentAnswer: optionId } : q
      )
    }));
  };

  // For MSQ: store selected option ids in studentAnswers (array)
  const handleMSQAnswer = (questionId, optionId, checked) => {
    setTestData(prevData => ({
      ...prevData,
      questions: prevData.questions.map(q => {
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
      })
    }));
  };

  // For NAT: store the entered text in response_text
  const handleNATAnswer = (questionId, value) => {
    setTestData(prevData => ({
      ...prevData,
      questions: prevData.questions.map(q =>
        q.question_id === questionId ? { ...q, response_text: value } : q
      )
    }));
  };

  // ---------------------
  // Submit Functionality
  // ---------------------
  // Build responses array from testData and call the submitTest API.
  const handleSubmitTest = async () => {
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
      // const result = await submitTest(testData.test_id, responses);
      toast.success("Test submitted successfully!");
      console.log("Submission Response:", result);
    } catch (error) {
      toast.error("Error submitting test.");
      console.error("Submit test error:", error);
    }
  };

  if (loading) return <div>Loading test...</div>;
  if (!testData) return <div>No test data available.</div>;

  return (
    <div className="px-4">
      <Toaster />
      {/* Top Fixed Panel */}
      <div className="fixed top-16 w-full bg-white z-20 shadow">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">{testData.title}</h1>
          <p className="mt-2 text-gray-700">{testData.description}</p>
          <div className="mt-2">
            <span>Scheduled on: {testData.schedule_date} at {testData.schedule_time}</span>
          </div>
          <div className="mt-2">
            <span>Duration: {testData.duration} minutes</span>
          </div>
          <div className="mt-2">
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>
          <div className="mt-4 flex gap-4">
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
        </div>
      </div>

{/* Left: Scrollable Question Editor */}
<div className="mt-[150px] mr-[33%] h-[calc(100vh-150px)] overflow-y-auto">
  {filteredQuestions.length > 0 ? (
    <div className="bg-white border rounded-lg shadow p-6 mb-4">
      <h2 className="text-xl font-semibold">Question No. {currentQuestionIndex + 1}</h2>
      <p className="mt-2">{currentQuestion.question_text}</p>
      {currentQuestion.image_url && (
        <img
          src={currentQuestion.image_url}
          alt="Question Attachment"
          className="mt-2 w-40 h-auto object-cover border rounded"
        />
      )}
      {/* Render options based on question type */}
      {currentQuestion.question_type === "MCQ" && (
        <div className="mt-4">
          {currentQuestion.options.map((opt, idx) => (
            <div key={opt.option_id} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name={`question-${currentQuestion.question_id}`}
                className="h-4 w-4 text-green-400"
                checked={currentQuestion.studentAnswer === opt.option_id}
                onChange={() => handleMCQAnswer(currentQuestion.question_id, opt.option_id)}
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
          ))}
        </div>
      )}
      {currentQuestion.question_type === "MSQ" && (
        <div className="mt-4">
          {currentQuestion.options.map((opt, idx) => {
            const checked = currentQuestion.studentAnswers && currentQuestion.studentAnswers.includes(opt.option_id);
            return (
              <div key={opt.option_id} className="flex items-center gap-2 mb-2">
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


      {/* Right Fixed Panel */}
      <div className="fixed right-4 top-32 bg-white rounded-lg shadow px-4 py-2 z-50">
        <h2 className="text-lg font-semibold mb-4">Questions</h2>
        <div className="flex flex-wrap gap-2 min-h-[17rem]">
          {filteredQuestions.map((q, index) => (
            <button
              key={q.question_id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded ${index === currentQuestionIndex ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"} hover:opacity-80`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-center text-gray-600">Total Questions: {filteredQuestions.length}</p>
        </div>
        <div className="flex justify-between gap-4 mt-2">
          <button
            onClick={handleSubmitTest}
            className="flex w-full justify-center items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            <Save className="w-4 h-4" />
            {loading ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </div>

      {/* Calculator (optional) */}
      {isCalculatorVisible && (
        <Draggable>
          <div className="fixed top-32 right-0 bg-gray-400 text-white p-2 rounded-xl shadow-lg z-50 cursor-move">
            <div className="flex justify-end">
              <button onClick={() => setIsCalculatorVisible(false)} className="text-gray-200 p py-1 rounded">
                <CircleX className="absolute top-8 right-6 text-white" />
              </button>
            </div>
            <Calculator />
          </div>
        </Draggable>
      )}
      <Toaster />
    </div>
  );
};

export default SubmitTest;

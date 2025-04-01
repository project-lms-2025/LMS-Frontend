import React, { useState } from 'react';
import { Plus, Trash2, Eye, Edit2, Clock, Save, Paperclip } from 'lucide-react';
import { createTestWithQuestions, uploadImageToS3 } from '../../api/test'; // Import API functions
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const CreateTest = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState("GA");
  const [showOptions, setShowOptions] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  // Initialize paper state with an empty questions array.
  const [questionPaper, setQuestionPaper] = useState({
    test_id: uuidv4(),
    // course_id: "5c10fb9a-7f14-420b-903d-497c4bdc97f4",
    series_id:"TS123",
    title: "",
    description: "",
    duration: "", // in minutes
    schedule_start: "",
    schedule_end: "",
    totalMarks: "",
    test_type: type,
    questions: [], // No default question here
  });

  // Derived filtered questions by section
  const filteredQuestions = questionPaper.questions.filter(
    (q) => q.section === selectedSection
  );

  // Update Functions
  const updateQuestion = (question_id, field, value) => {
    setQuestionPaper((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.question_id === question_id ? { ...q, [field]: value } : q
      ),
    }));
  };

  const updateOption = (questionId, optionIndex, value, isCorrect = false) => {
    setQuestionPaper((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.question_id === questionId
          ? {
            ...q,
            options: q.options.map((opt, idx) =>
              idx === optionIndex
                ? { ...opt, option_text: value, is_correct: isCorrect }
                : opt
            ),
          }
          : q
      ),
    }));
  };

  // MCQ Selection: set selected option as correct and update correct_option_id
  const handleMCQSelection = (question, optionIndex) => {
    question.options.forEach((opt, idx) => {
      const isCorrect = idx === optionIndex;
      updateOption(question.question_id, idx, opt.option_text, isCorrect);
    });
    updateQuestion(question.question_id, "correctAnswer", optionIndex);
    const selectedOptionId = question.options[optionIndex].option_id;
    updateQuestion(question.question_id, "correct_option_id", selectedOptionId);
  };

  // MSQ Selection: update multiple correct options; join their option_ids with underscore
  const handleMSQSelection = (question, optionIndex, isChecked) => {
    let newCorrectAnswers = question.correctAnswers ? [...question.correctAnswers] : [];
    if (isChecked) {
      newCorrectAnswers.push(optionIndex);
    } else {
      newCorrectAnswers = newCorrectAnswers.filter(index => index !== optionIndex);
    }
    question.options.forEach((opt, idx) => {
      const isCorrect = newCorrectAnswers.includes(idx);
      updateOption(question.question_id, idx, opt.option_text, isCorrect);
    });
    updateQuestion(question.question_id, "correctAnswers", newCorrectAnswers);
    const correctOptionIds = newCorrectAnswers.map(idx => question.options[idx].option_id);
    const joinedOptionIds = correctOptionIds.sort().join("_");
    console.log(joinedOptionIds)
    updateQuestion(question.question_id, "correct_option_id", joinedOptionIds);
  };

  // NAT Selection: always mark the single option as correct
  const handleNATSelection = (question, value) => {
    updateOption(question.question_id, 0, value, true);
    updateQuestion(question.question_id, "correct_option_id", question.options[0].option_id);
  };

  // Update question-level attachment with uploaded file URL
  const updateQuestionAttachment = (questionId, fileUrl) => {
    setQuestionPaper((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.question_id === questionId ? { ...q, image_url: fileUrl } : q
      ),
    }));
  };

  // ----------------------
  // Question Management
  // ----------------------
  const addQuestion = (type = "MCQ") => {
    const newQuestion = {
      question_id: uuidv4(),
      section: selectedSection,
      question_text: "",
      question_type: type,
      positive_marks: "",
      negative_marks: "",
      image_url: "",
      correct_option_id: "",
      options:
        type === "NAT"
          ? [{ option_id: uuidv4(), option_text: "", is_correct: true }]
          : Array(4)
            .fill(null)
            .map(() => ({
              option_id: uuidv4(),
              option_text: "",
              is_correct: false,
              image_url: "",
            })),
      marks: 1,
    };
    setQuestionPaper((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      totalMarks: parseInt(prev.totalMarks || 0) + 1,
    }));
  };

  const removeQuestion = (question_id) => {
    setQuestionPaper((prev) => {
      const question = prev.questions.find((q) => q.question_id === question_id);
      return {
        ...prev,
        questions: prev.questions.filter((q) => q.question_id !== question_id),
        totalMarks: parseInt(prev.totalMarks || 0) - (parseInt(question?.positive_marks || 0)),
      };
    });
  };

  // File Upload Handling
  const handleFileChange = async (e, questionId, optionIndex, fileTypeCategory) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      let url;
      if (optionIndex === "question") {
        url = await uploadImageToS3(file, questionPaper.test_id, "question", questionId);
        if (url) {
          updateQuestionAttachment(questionId, url);
        }
      } else {
        url = await uploadImageToS3(file, questionPaper.test_id, "option", `${questionId}-${optionIndex}`);
        if (url) {
          setQuestionPaper((prev) => ({
            ...prev,
            questions: prev.questions.map((q) => {
              if (q.question_id === questionId) {
                return {
                  ...q,
                  options: q.options.map((opt, idx) =>
                    idx === optionIndex ? { ...opt, image_url: url } : opt
                  ),
                };
              }
              return q;
            }),
          }));
        }
      }
    } else {
      console.warn("Only image uploads are supported in this demo.");
    }
    setShowOptions((prev) => ({
      ...prev,
      [`${questionId}-${optionIndex}`]: false,
    }));
  };

  // Toggle file upload popup for a given question-option pair or question-level ("question")
  const toggleOptions = (questionId, optionIndex) => {
    setShowOptions((prev) => ({
      ...prev,
      [`${questionId}-${optionIndex}`]: !prev[`${questionId}-${optionIndex}`],
    }));
  };

  const handleOptionTextChange = (e, questionId, optionIndex) => {
    updateOption(questionId, optionIndex, e.target.value);
  };

  // Validation Function
  const validateFields = () => {
    // Validate test details
    if (!questionPaper.title.trim()) {
      toast.error("Please enter a test title.");
      return false;
    }

    if (!questionPaper.duration || questionPaper.duration <= 0) {
      toast.error("Please enter a valid test duration (greater than 0 minutes).");
      return false;
    }

    if (!questionPaper.schedule_start) {
      toast.error("Please select a scheduled start for the test.");
      return false;
    }

    if (!questionPaper.schedule_end) {
      toast.error("Please select a scheduled end for the test.");
      return false;
    }

    if (!questionPaper.description.trim()) {
      toast.error("Please enter a test description.");
      return false;
    }

    // Validate questions
    if (questionPaper.questions.length === 0) {
      toast.error("Please add at least one question to the test.");
      return false;
    }

    for (let q of questionPaper.questions) {
      if (!q.question_text) {
        toast.error("Please fill in the question text.");
        return false;
      }
      if (q.question_type === "NAT") {
        if (!q.options[0].option_text) {
          toast.error("Please fill in the option text for NAT question.");
          return false;
        }
      } else {
        for (let opt of q.options) {
          if (!opt.option_text) {
            toast.error("Please fill in all option texts.");
            return false;
          }
        }
      }
    }
    return true;
  };

  // Test Creation Function
  const savePaper = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (!validateFields()) return;
      const testPayload = { ...questionPaper };
      console.log(testPayload);
      const result = await createTestWithQuestions(testPayload);
      toast.success('Test created successfully!');
      console.log(result);
    } catch (error) {
      toast.error('Error creating test.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" px-4 ">
      <ToastContainer />
      {/* Top Paper Details */}
      <div className='  w-full bg-white z-20' >
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={questionPaper.title}
                onChange={(e) =>
                  setQuestionPaper((prev) => ({ ...prev, title: e.target.value }))
                }
                disabled={isPreview}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Enter paper title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="number"
                  value={questionPaper.duration}
                  onChange={(e) =>
                    setQuestionPaper((prev) => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 0,
                    }))
                  }
                  disabled={isPreview}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
            {/* Schedule Start */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Start</label>
              <input
                type="datetime-local"
                value={questionPaper.schedule_start || ""}
                onChange={(e) =>
                  setQuestionPaper((prev) => ({
                    ...prev,
                    schedule_start: e.target.value,
                  }))
                }
                disabled={isPreview}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Schedule End */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule End</label>
              <input
                type="datetime-local"
                value={questionPaper.schedule_end || ""}
                onChange={(e) =>
                  setQuestionPaper((prev) => ({
                    ...prev,
                    schedule_end: e.target.value,
                  }))
                }
                disabled={isPreview}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={questionPaper.description}
              onChange={(e) =>
                setQuestionPaper((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              disabled={isPreview}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              rows={1}
              placeholder="Enter paper description"
            />
          </div>

        </div>
        {/* Section Selector */}
        <div className="rounded-lg mb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedSection("GA")}
              className={`px-4 py-2 rounded ${selectedSection === "GA"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
                }`}
            >
              General Aptitude (GA)
            </button>
            <button
              onClick={() => setSelectedSection("Subject")}
              className={`px-4 py-2 rounded border ${selectedSection === "Subject"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
                }`}
            >
              Subject-specific Section
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4  ">
        {/* Left: Question Editor */}
        <div className="w-[66.5%] mt-[0px] h-[55vh] overflow-y-auto">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question, idx) => (
              <div key={question.question_id} className="bg-white border rounded-lg shadow p-6 mb-4">
                <div className="flex justify-between items-center gap-4 mb-4">
                  <h2 className="text-xl font-semibold">Question No.  {idx + 1}</h2>
                  <div className="flex gap-6">
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-green-500">Correct Marks</label>
                      <input
                        type="number"
                        value={question.positive_marks}
                        onChange={(e) =>
                          updateQuestion(question.question_id, 'positive_marks', e.target.value)
                        }
                        className="w-24 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-red-500">Negative Marks</label>
                      <input
                        type="number"
                        value={question.negative_marks}
                        onChange={(e) =>
                          updateQuestion(question.question_id, 'negative_marks', e.target.value)
                        }
                        className="w-24 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required={question.question_type === "MCQ"}
                      />
                    </div>
                    <div className="flex flex-col pt-7 text-red-500">
                      <Trash2 size={24} onClick={() => removeQuestion(question.question_id)} />
                    </div>
                  </div>
                </div>

                {/* Question Text and Attachment */}
                <div className="flex gap-2 items-center mb-4">
                  <textarea
                    className="w-full border border-gray-300 rounded p-2"
                    rows={1}
                    value={question.question_text}
                    onChange={(e) =>
                      updateQuestion(question.question_id, "question_text", e.target.value)
                    }
                    placeholder="Enter question text here..."
                    required
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleOptions(question.question_id, "question")}
                      className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                      <Paperclip className="w-5 h-5 text-gray-700" />
                    </button>
                    {showOptions[`${question.question_id}-question`] && (
                      <div className="absolute right-1/4 mt-2 bg-white border rounded shadow-md w-20  z-50">
                        {["Image", "Video", "Audio"].map((type) => (
                          <label
                            key={type}
                            className="block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                          >
                            {type}
                            <input
                              type="file"
                              accept={
                                type === "Image"
                                  ? "image/*"
                                  : type === "Video"
                                    ? "video/*"
                                    : "audio/*"
                              }
                              className="hidden"
                              onChange={(e) =>
                                handleFileChange(e, question.question_id, "question", type)
                              }
                            />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview question attachment if available */}
                {question.image_url && (
                  <img
                    src={question.image_url}
                    alt="Question Attachment"
                    className="mb-2 w-[25rem] h-auto object-cover border border-gray-300 rounded"
                  />
                )}

                {/* MCQ Editor */}
                {question.question_type === "MCQ" && (
                  <div className="space-y-2">
                    {question.options.map((opt, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="radio"
                            name={`question-${question.question_id}`}
                            className="h-4 w-4 text-green-400"
                            checked={question.correctAnswer === idx} // Check if this option is the correct one
                            onChange={() => handleMCQSelection(question, idx)} // Handle MCQ selection
                            required
                          />
                          <input
                            type="text"
                            value={opt.option_text}
                            onChange={(e) => handleOptionTextChange(e, question.question_id, idx)} // Handle option text change
                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`Option ${idx + 1}`}
                            required
                          />
                          {/* Image upload button */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => toggleOptions(question.question_id, idx)}
                              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                              <Paperclip className="w-5 h-5 text-gray-700 " />
                            </button>
                            {showOptions[`${question.question_id}-${idx}`] && (
                              <div className="absolute right-1/4 mt-2 bg-white border rounded shadow-md w-20 z-50 ">
                                {["Image", "Video", "Audio"].map((type) => (
                                  <label
                                    key={type}
                                    className="block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                  >
                                    {type}
                                    <input
                                      type="file"
                                      accept={
                                        type === "Image"
                                          ? "image/*"
                                          : type === "Video"
                                            ? "video/*"
                                            : "audio/*"
                                      }
                                      className="hidden"
                                      onChange={(e) =>
                                        handleFileChange(e, question.question_id, idx, type) // Image, Video or Audio upload
                                      }
                                    />
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        {opt.image_url && (
                          <img
                            src={opt.image_url}
                            alt={`Option ${idx} Attachment`}
                            className="mb-1 w-20 h-auto object-cover border border-gray-300 rounded"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}




                {/* MSQ Editor */}
                {question.question_type === "MSQ" && (
                  <div className="space-y-2">
                    {question.options.map((opt, idx) => {
                      const checked = question.correctAnswers && question.correctAnswers.includes(idx);
                      return (
                        <div key={idx} className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={checked}
                              onChange={(e) => handleMSQSelection(question, idx, e.target.checked)} // Handle MSQ selection
                              required
                            />
                            <input
                              type="text"
                              value={opt.option_text}
                              onChange={(e) => handleOptionTextChange(e, question.question_id, idx)} // Handle option text change
                              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Option ${idx + 1}`}
                              required
                            />
                            {/* Image upload button */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => toggleOptions(question.question_id, idx)}
                                className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                              >
                                <Paperclip className="w-5 h-5 text-gray-700" />
                              </button>
                              {showOptions[`${question.question_id}-${idx}`] && (
                                <div className="absolute right-1/4 z-50 mt-2 bg-white border rounded shadow-md w-32 ">
                                  {["Image", "Video", "Audio"].map((type) => (
                                    <label
                                      key={type}
                                      className="block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                    >
                                      {type}
                                      <input
                                        type="file"
                                        accept={
                                          type === "Image"
                                            ? "image/*"
                                            : type === "Video"
                                              ? "video/*"
                                              : "audio/*"
                                        }
                                        className="hidden"
                                        onChange={(e) =>
                                          handleFileChange(e, question.question_id, idx, type) // Image, Video or Audio upload
                                        }
                                      />
                                    </label>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {opt.image_url && (
                            <img
                              src={opt.image_url}
                              alt={`Option ${idx} Attachment`}
                              className="mb-1 w-20 h-auto object-cover border border-gray-300 rounded"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}




                {/* NAT Editor */}
                {question.question_type === "NAT" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Answer</label>
                    <input
                      type="text"
                      value={question.options[0]?.option_text || ""} // Use the first option's text field to store the answer
                      onChange={(e) =>
                        updateOption(question.question_id, 0, e.target.value, true) // Update the first option's text (which stores the answer)
                      }
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter answer"
                      required
                    />
                  </div>
                )}

              </div>
            ))
          ) : (
            <div className='border rounded-xl h-full flex justify-center items-center' >
              <h1 className='text-xl' >No question created </h1>
            </div>
          )}
        </div>

        {/* Right: Question Navigation and Actions */}
        <div className="w-[32%]  right-4 bottom-5 bg-white border rounded-lg shadow px-4 py-2 z-50">
          <h2 className="text-lg font-semibold mb-4">Questions</h2>
          <div className="flex flex-wrap gap-2 min-h-[15rem]">
            {filteredQuestions.map((q, index) => {
              let btnColor = "bg-gray-200 text-gray-800";
              if (q.question_type === "MSQ") btnColor = "bg-blue-200 text-blue-800";
              if (q.question_type === "NAT") btnColor = "bg-purple-200 text-purple-800";
              if (q.status === "Answered") btnColor = "bg-green-200 text-green-800";
              if (q.status === "Marked for Review") btnColor = "bg-yellow-200 text-yellow-800";
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
          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={() => addQuestion('MCQ')}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 text-sm hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add MCQ
            </button>
            <button
              onClick={() => addQuestion('NAT')}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 text-sm hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add NAT
            </button>
            <button
              onClick={() => addQuestion('MSQ')}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 text-sm hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add MSQ
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                Total Questions: {questionPaper.questions.length}
              </div>
              <div className="text-gray-600">Total Marks: {questionPaper.totalMarks}</div>
            </div>
          </div>
          <div className="flex justify-between gap-4 mt-2">
            <button
              onClick={() =>
                window.open(`/testpreview?test_id=${questionPaper.test_id}`, '_blank')
              }
              className="flex w-full justify-center items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
            >
              <Eye className="w-4 h-4" />
              Watch Preview
            </button>
            <button
              onClick={savePaper}
              className="flex w-full justify-center items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Paper"}
            </button>
          </div>
          {message && (
            <div className="mt-2 text-sm text-center text-green-600">{message}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTest;

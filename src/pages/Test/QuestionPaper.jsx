import React, { useState } from 'react';
import { Plus, Trash2, Eye, Edit2, Clock, Save, Delete, Paperclip } from 'lucide-react';

const QuestionPaper = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState("GA");
  const [showOptions, setShowOptions] = useState({}); // Track which dropdown is open

  const [questionPaper, setQuestionPaper] = useState({
    title: "",
    description: "",
    duration: 60,
    scheduleDate: "",
    scheduleTime: "",
    totalMarks: 0,
    questions: [],
  });

  // Update a question field
  const updateQuestion = (id, field, value) => {
    setQuestionPaper((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    }));
  };

  // Update a specific option in a question
  const updateOption = (questionId, optionIndex, value) => {
    setQuestionPaper((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
            ...q,
            options: q.options.map((opt, idx) =>
              idx === optionIndex ? value : opt
            ),
          }
          : q
      ),
    }));
  };

  // Add a new question of a given type
  const addQuestion = (type = "MCQ") => {
    const newQuestion = {
      id: questionPaper.questions.length + 1,
      section: selectedSection, // Assign current section
      text: "",
      type, // 'MCQ', 'NAT', 'MSQ'
      options: type === "NAT" ? [] : ["", "", "", ""],
      correctAnswer: type === "MCQ" ? 0 : undefined,
      correctAnswers: type === "MSQ" ? [] : undefined,
      correctAnswerText: type === "NAT" ? "" : undefined,
      marks: 1,
      incorrectMarks: type === "MCQ" ? 0.33 : 0,
      status: "Not Answered",
    };

    setQuestionPaper((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      totalMarks: prev.totalMarks + 1,
    }));
  };

  // Remove a question by ID
  const removeQuestion = (id) => {
    setQuestionPaper((prev) => {
      const question = prev.questions.find((q) => q.id === id);
      return {
        ...prev,
        questions: prev.questions.filter((q) => q.id !== id),
        totalMarks: prev.totalMarks - (question?.marks || 0),
      };
    });
  };

  // Select a question by index
  const onSelectQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Filter questions by selected section
  const filteredQuestions = questionPaper.questions.filter(
    (q) => q.section === selectedSection
  );

  // Toggle file upload options for a specific question-option pair
  const toggleOptions = (questionId, optionIndex) => {
    setShowOptions((prev) => ({
      ...prev,
      [`${questionId}-${optionIndex}`]: !prev[`${questionId}-${optionIndex}`],
    }));
  };

  // Handle file selection
  const handleFileChange = (e, questionId, optionIndex, type) => {
    updateOption(questionId, optionIndex, { file: e.target.files[0], type });
    setShowOptions((prev) => ({
      ...prev,
      [`${questionId}-${optionIndex}`]: false, // Close menu after selection
    }));
  };
  return (
    <div className=" h-full bg- p-4 pb-8">
      {/* Top Paper Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Date
            </label>
            <input
              type="date"
              value={questionPaper.scheduleDate || ""}
              onChange={(e) =>
                setQuestionPaper((prev) => ({
                  ...prev,
                  scheduleDate: e.target.value,
                }))
              }
              disabled={isPreview}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Time
            </label>
            <input
              type="time"
              value={questionPaper.scheduleTime || ""}
              onChange={(e) =>
                setQuestionPaper((prev) => ({
                  ...prev,
                  scheduleTime: e.target.value,
                }))
              }
              disabled={isPreview}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
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
      <div className=" rounded-lg   mb-4">
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
            className={`px-4 py-2 bg-white rounded border ${selectedSection === "Subject"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
              }`}
          >
            Subject-specific Section
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Left: Question Editor (70%) */}
        <div className="w-[66.5%] h-screen">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <div className="bg-white rounded-lg shadow p-6 mb-2">
                <div className="flex justify-between items-center gap-4 mb-4">
                  <h2 className="text-xl font-semibold">
                    Question No. {question.id}
                  </h2>
                  <div className="flex gap-6">
                    {/* Correct Marks */}
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-green-500">
                        Correct Marks
                      </label>
                      <input
                        type="number"
                        value={question.marks}
                        onChange={(e) =>
                          updateQuestion(question.id, 'marks', e.target.value)
                        }
                        className="w-24 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* Negative Marks (for MCQ only) */}
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-red-500">
                        Negative Marks
                      </label>
                      <input
                        type="number"
                        value={question.incorrectMarks}
                        onChange={(e) =>
                          updateQuestion(question.id, 'incorrectMarks', e.target.value)
                        }
                        className="w-24 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required={question.type === "MCQ"} // Make it required only for MCQ questions
                      />
                    </div>
                    <div className="flex flex-col pt-7 text-red-500">
                      <Trash2 size={24} />
                    </div>
                  </div>
                </div>

                {/* Question Text */}
                <div className="flex gap-2 items-center mb-4">
                  <textarea
                    className="w-full border border-gray-300 rounded p-2"
                    rows={1}
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(question.id, "text", e.target.value)
                    }
                    placeholder="Enter question text here..."
                    required
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowOptions((prev) => ({
                          ...prev,
                          [`${question.id}-question`]: !prev[`${question.id}-question`],
                        }))
                      }
                      className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                      <Paperclip className="w-5 h-5 text-gray-700" />
                    </button>

                    {/* Dropdown for question-level attachment */}
                    {showOptions[`${question.id}-question`] && (
                      <div className="absolute left-0 mt-2 bg-white border rounded shadow-md w-32 z-50">
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
                                handleFileChange(e, question.id, "question", type)
                              }
                            />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Multiple Choice Questions (MCQ) */}
                {question.type === "MCQ" && (
                  <div className="space-y-2">
                    {question.options.map((opt, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            className="h-4 w-4 text-green-400"
                            checked={question.correctAnswer === idx}
                            onChange={() =>
                              updateQuestion(question.id, "correctAnswer", idx)
                            }
                            required
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) =>
                              updateOption(question.id, idx, e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`Option ${idx + 1}`}
                            required
                          />
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setShowOptions((prev) => ({
                                  ...prev,
                                  [`${question.id}-${idx}`]: !prev[`${question.id}-${idx}`],
                                }))
                              }
                              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                              <Paperclip className="w-5 h-5 text-gray-700" />
                            </button>

                            {/* Dropdown for option-specific file upload */}
                            {showOptions[`${question.id}-${idx}`] && (
                              <div className="absolute left-0 mt-2 bg-white border rounded shadow-md w-32 z-50">
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
                                        handleFileChange(e, question.id, idx, type)
                                      }
                                    />
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Option Image Preview */}
                        {question.optionImages && question.optionImages[idx] && (
                          <img
                            src={question.optionImages[idx]}
                            alt="Option"
                            className="mb-1 w-20 h-auto object-cover border border-gray-300 rounded"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "MSQ" && (
                  <div className="space-y-2">
                    {question.options.map((opt, idx) => {
                      const checked = question.correctAnswers && question.correctAnswers.includes(idx);
                      return (
                        <div key={idx} className=" mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={checked}
                              onChange={(e) => {
                                let currentAnswers = question.correctAnswers || [];
                                if (e.target.checked) {
                                  currentAnswers.push(idx);
                                } else {
                                  currentAnswers = currentAnswers.filter((i) => i !== idx);
                                }
                                updateQuestion(question.id, 'correctAnswers', currentAnswers);
                              }}
                              required
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => updateOption(question.id, idx, e.target.value)}
                              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Option ${idx + 1}`}
                              required
                            />
                            {/* Option Image Upload & Preview */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setShowOptions((prev) => ({
                                  ...prev,
                                  [`${question.id}-${idx}`]: !prev[`${question.id}-${idx}`],
                                }))
                              }
                              className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                              <Paperclip className="w-5 h-5 text-gray-700" />
                            </button>

                            {/* Dropdown for option-specific file upload */}
                            {showOptions[`${question.id}-${idx}`] && (
                              <div className="absolute left-0 mt-2 bg-white border rounded shadow-md w-32 z-50">
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
                                        handleFileChange(e, question.id, idx, type)
                                      }
                                    />
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                          </div>

                          
                          
                        </div>
                      );
                    })}
                  </div>
                )}

                {question.type === "NAT" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Answer
                    </label>
                    <input
                      type="text"
                      value={question.correctAnswerText || ""}
                      onChange={(e) =>
                        updateQuestion(question.id, 'correctAnswerText', e.target.value)
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
            <p>No question selected.</p>
          )}
        </div>

        {/* Right: Question Navigation (scrollable) */}
        <div className="w-[32%] fixed right-4 bottom-5 bg-white rounded-lg shadow px-4 py-2">
          <h2 className="text-lg font-semibold mb-4">Questions</h2>
          <div className="flex flex-wrap gap-2  min-h-[17rem]">
            {filteredQuestions.map((q, index) => {
              let btnColor = "";
              if (q.type === "MCQ") {
                btnColor = "bg-gray-200 text-gray-800";
              } else if (q.type === "MSQ") {
                btnColor = "bg-blue-200 text-blue-800";
              } else if (q.type === "NAT") {
                btnColor = "bg-purple-200 text-purple-800";
              }
              if (q.status === "Answered") {
                btnColor = "bg-green-200 text-green-800";
              } else if (q.status === "Marked for Review") {
                btnColor = "bg-yellow-200 text-yellow-800";
              }
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
          <div className=" grid grid-cols-3 gap-2 mt-4">
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

          <div className="bg-white  rounded-lg shadow p-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                Total Questions: {questionPaper.questions.length}
              </div>
              <div className="text-gray-600">
                Total Marks: {questionPaper.totalMarks}
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-4 mt-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex w-full justify-center items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
            >
              {isPreview ? (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Mode
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Preview
                </>
              )}
            </button>
            <button
              onClick={() => console.log(questionPaper)}
              className="flex w-full justify-center items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              Save Paper
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}

    </div>
  );
};

export default QuestionPaper;

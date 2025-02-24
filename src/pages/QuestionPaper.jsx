import React, { useState } from 'react';
import { Plus, Trash2, Eye, Edit2, Clock, Save } from 'lucide-react';

const QuestionPaper = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState("GA");
  const [questionPaper, setQuestionPaper] = useState({
    title: '',
    description: '',
    duration: 60,
    scheduleDate: '',
    scheduleTime: '',
    totalMarks: 0,
    questions: [],
  });

  // Update a question field
  const updateQuestion = (id, field, value) => {
    setQuestionPaper((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === id) {
          return { ...q, [field]: value };
        }
        return q;
      }),
    }));
  };

  // Update a specific option in a question
  const updateOption = (questionId, optionIndex, value) => {
    setQuestionPaper((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    }));
  };

  // Add a new question of a given type with sequential numbering
  const addQuestion = (type = "MCQ") => {
    const newQuestion = {
      id: questionPaper.questions.length + 1,
      section: selectedSection, // assign current section
      text: '',
      type, // 'MCQ', 'NAT', 'MSQ'
      options: type === "NAT" ? [] : ['', '', '', ''],
      correctAnswer: type === 'MCQ' ? 0 : undefined,
      correctAnswers: type === 'MSQ' ? [] : undefined,
      correctAnswerText: type === 'NAT' ? '' : undefined,
      marks: 1,
      incorrectMarks: type === 'MCQ' ? 0.33 : 0,
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

  const filteredQuestions = questionPaper.questions.filter(q => q.section === selectedSection);

  return (
    <div className=" h-full bg-gray-100 p-4 pb-8">
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
      <div className="bg-white rounded-lg shadow p-4 mb-4">
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
            className={`px-4 py-2 rounded ${selectedSection === "Subject"
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
                      />
                    </div>
                    {/* Negative Marks (for MCQ only) */}
                    {/* {question.type === "MCQ" && ( */}
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
                        />
                      </div>
                    {/* )} */}
                  </div>
                </div>

                {/* Question Text */}
                <textarea
                  className="w-full border border-gray-300 rounded p-2 mb-4"
                  rows={1}
                  value={question.text}
                  onChange={(e) =>
                    updateQuestion(question.id, 'text', e.target.value)
                  }
                  placeholder="Enter question text here..."
                />

                {/* Conditional Rendering based on Question Type */}
                {question.type === "MCQ" && (
                  <div className="space-y-2">
                    {question.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          className="h-4 w-4"
                          checked={question.correctAnswer === idx}
                          onChange={() =>
                            updateQuestion(question.id, 'correctAnswer', idx)
                          }
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            updateOption(question.id, idx, e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Option ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "MSQ" && (
                  <div className="space-y-2">
                    {question.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={
                            question.correctAnswers &&
                            question.correctAnswers.includes(idx)
                          }
                          onChange={(e) => {
                            let currentAnswers = question.correctAnswers || [];
                            if (e.target.checked) {
                              currentAnswers.push(idx);
                            } else {
                              currentAnswers = currentAnswers.filter((i) => i !== idx);
                            }
                            updateQuestion(question.id, 'correctAnswers', currentAnswers);
                          }}
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) =>
                            updateOption(question.id, idx, e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Option ${idx + 1}`}
                        />
                      </div>
                    ))}
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
          <div className="flex flex-wrap gap-2  min-h-[11.5rem]">
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

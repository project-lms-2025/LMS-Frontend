import React, { useState } from 'react';
import { Plus, Trash2, Eye, Edit2, Clock, Save } from 'lucide-react';

const QuestionPaper = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [questionPaper, setQuestionPaper] = useState({
    title: '',
    description: '',
    duration: 60,
    totalMarks: 0,
    questions: [],
  });

  const addQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1,
    };
    setQuestionPaper((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      totalMarks: prev.totalMarks + 1,
    }));
  };

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

  const updateQuestion = (id, field, value) => {
    setQuestionPaper((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => {
        if (q.id === id) {
          if (field === 'marks') {
            const oldMarks = q.marks;
            const newMarks = parseInt(value) || 0;
            setQuestionPaper((p) => ({
              ...p,
              totalMarks: p.totalMarks - oldMarks + newMarks,
            }));
          }
          return { ...q, [field]: value };
        }
        return q;
      }),
    }));
  };

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Create Question Paper</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
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
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            <Save className="w-4 h-4" />
            Save Paper
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Paper Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={questionPaper.title}
                onChange={(e) =>
                  setQuestionPaper((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
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
              {/* <label className="block text-sm font-medium text-gray-700 mb-1">
               Dates 
              </label> */}
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
              rows={3}
              placeholder="Enter paper description"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questionPaper.questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg shadow p-6">
              {isPreview ? (
                <PreviewQuestion question={question} questionNumber={index + 1} />
              ) : (
                <EditQuestion
                  question={question}
                  questionNumber={index + 1}
                  onUpdate={(field, value) => updateQuestion(question.id, field, value)}
                  onUpdateOption={(optionIndex, value) =>
                    updateOption(question.id, optionIndex, value)
                  }
                  onRemove={() => removeQuestion(question.id)}
                />
              )}
            </div>
          ))}

          {!isPreview && (
            <button
              onClick={addQuestion}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Question
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-600">Total Questions: {questionPaper.questions.length}</div>
            <div className="text-gray-600">Total Marks: {questionPaper.totalMarks}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditQuestion = ({ question, questionNumber, onUpdate, onUpdateOption, onRemove }) => (
  <div>
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-lg font-semibold text-gray-700">Question {questionNumber}</span>
          <input
            type="number"
            value={question.marks}
            onChange={(e) => onUpdate('marks', parseInt(e.target.value) || 0)}
            className="w-20 px-2 py-1 border rounded-md"
            placeholder="Marks"
          />
        </div>
        <textarea
          value={question.text}
          onChange={(e) => onUpdate('text', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows={2}
          placeholder="Enter question text"
        />
      </div>
      <button onClick={onRemove} className="ml-4 text-red-500 hover:text-red-700">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>

    <div className="space-y-3">
      {question.options.map((option, index) => (
        <div key={index} className="flex items-center gap-3">
          <input
            type="radio"
            name={`correct-${question.id}`}
            checked={question.correctAnswer === index}
            onChange={() => onUpdate('correctAnswer', index)}
            className="w-4 h-4 text-blue-600"
          />
          <input
            type="text"
            value={option}
            onChange={(e) => onUpdateOption(index, e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Option ${index + 1}`}
          />
        </div>
      ))}
    </div>
  </div>
);

const PreviewQuestion = ({ question, questionNumber }) => (
  <div>
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-semibold text-gray-700">Question {questionNumber}</span>
        <span className="text-sm text-gray-500">({question.marks} marks)</span>
      </div>
      <p className="text-gray-900">{question.text}</p>
    </div>

    <div className="space-y-3">
      {question.options.map((option, index) => (
        <label key={index} className="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50">
          <input
            type="radio"
            name={`preview-${question.id}`}
            disabled
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

export default QuestionPaper;

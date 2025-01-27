import React from 'react';
import { Timer } from 'lucide-react';

export function TestWindow({ 
  test, 
  timeRemaining, 
  userAnswers, 
  onAnswerSelect, 
  onSubmit,
  formatTime 
}) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{test.title}</h1>
          <div className="flex items-center space-x-4">
            <Timer className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-semibold text-blue-500">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {test.questions.map((question, qIndex) => (
            <div key={question.id} className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                {qIndex + 1}. {question.text}
              </h3>
              <div className="space-y-3">
                {question.options.map((option, oIndex) => (
                  <label
                    key={oIndex}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      userAnswers.find(a => a.questionId === question.id)?.selectedOption === oIndex
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      className="hidden"
                      checked={userAnswers.find(a => a.questionId === question.id)?.selectedOption === oIndex}
                      onChange={() => onAnswerSelect(question.id, oIndex)}
                    />
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      userAnswers.find(a => a.questionId === question.id)?.selectedOption === oIndex
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {userAnswers.find(a => a.questionId === question.id)?.selectedOption === oIndex && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onSubmit}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}

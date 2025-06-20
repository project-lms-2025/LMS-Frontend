import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile } from '../../api/auth';
import { getTestResultDetails } from '../../api/test';



const StudentResponse = () => {
  const [testData, setTestData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { resultId } = useParams();  // Retrieve resultId from URL

  // Fetch User Profile and Test Results
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getUserProfile(); // Fetch user data
        setUserData(userProfile.data); // Set user profile data
        fetchTestResults(userProfile.data.user_id); // Fetch test results using student ID
      } catch (err) {
        setError('Failed to load user profile');
        setLoading(false);
      }
    };

    const fetchTestResults = async (studentId) => {
      try {
        const response = await getTestResultDetails(resultId, studentId); // Fetch test results using resultId and studentId
        console.log("Test results:", response);
        const data = response.data;
        setTestData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile(); // Fetch user profile on component mount
  }, [resultId]); // Re-run this effect when resultId changes

  // Loading and error handling
  if (loading) {
    return <div className="p-6 text-center">Loading test results...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  if (!testData) {
    return <div className="p-6 text-center">No test data available</div>;
  }

  // Calculate total attempted and correct questions
  const totalAttempted = testData.questions.filter(q =>
    (q.question_type === 'NAT' && q.given_ans_text) ||
    (q.question_type === 'MCQ' && q.options.some(opt => opt.selected)) ||
    (q.question_type === 'MSQ' && q.options.some(opt => opt.selected))
  ).length;

  const totalCorrect = testData.questions.filter(q => {
    if (q.question_type === 'NAT') {
      return q.given_ans_text === q.options[0].option_text;
    } else if (q.question_type === 'MCQ') {
      const selectedOption = q.options.find(opt => opt.selected);
      return selectedOption && selectedOption.is_correct;
    } else if (q.question_type === 'MSQ') {
      const selectedOptions = q.options.filter(opt => opt.selected);
      const correctOptions = q.options.filter(opt => opt.is_correct);
      return selectedOptions.length === correctOptions.length &&
        selectedOptions.every(opt => opt.is_correct);
    }
    return false;
  }).length;

  // Helper function to get option classes for highlighting selected/correct options
  const getOptionClasses = (option, questionType) => {
    let bgClass = 'bg-white';
    if (option.is_correct) {
      bgClass = 'bg-green-200'; // Correct option
    }
    if (option.selected && !option.is_correct) {
      bgClass = 'bg-red-200'; // Incorrect option
    }
    const borderClass = option.selected ? 'border-2 border-blue-500' : ''; // Selected option with border
    return `${bgClass} ${borderClass} p-2 rounded`;
  };


  const rank = '45/100';
  const correct = 30;
  const incorrect = 10;
  const unanswered = 10;
  const mark = '45/100';


  return (
    <div className="p-6 w-full mx-auto space-y-6 bg-gray-50 mt-20">

      {/* <div className="bg-white shadow rounded-md p-6">
        <div className="grid sm:grid-cols-5 grid-cols-2 gap-4 text-center">
          <div className="flex flex-col items-center border p-4 rounded-md">
            <p className="text-2xl font-bold text-gray-900">{rank}</p>
            <p className="text-sm text-gray-600">Your Rank</p>
          </div>
          <div className="flex flex-col items-center border p-4 rounded-md">
            <p className="text-2xl font-bold text-green-600">{correct}</p>
            <p className="text-sm text-gray-600">Correct Answers</p>
          </div>
          <div className="flex flex-col items-center border p-4 rounded-md">
            <p className="text-2xl font-bold text-red-600">{incorrect}</p>
            <p className="text-sm text-gray-600">Incorrect Answers</p>
          </div>
          <div className="flex flex-col items-center border p-4 rounded-md">
            <p className="text-2xl font-bold text-yellow-600">{unanswered}</p>
            <p className="text-sm text-gray-600">Unanswered</p>
          </div>
          <div className="flex flex-col items-center border p-4 rounded-md">
            <p className="text-2xl font-bold text-blue-600">{mark}</p>
            <p className="text-sm text-gray-600">Mark</p>
          </div>
        </div>
      </div> */}



      {/* Header Summary */}
      <div className="bg-white shadow rounded p-4 lg:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{testData.title}</h1>
          <p className="text-sm text-gray-600">{testData.description}</p>
          <p className="text-sm font-semibold text-gray-600 mt-1">
            Total Questions: {testData.questions.length} | Duration: {testData.duration} minutes
          </p>
          <p className="text-sm text-gray-600">
            Scheduled for: {new Date(testData.schedule_start).toLocaleDateString()} at {new Date(testData.schedule_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
          </p>
        </div>
        <div className="flex flex-col lg:items-end mt-2 lg:mt-0">
          <p className="text-gray-700">
            Attempted: <span className="font-semibold">{totalAttempted}</span> / {testData.questions.length}
          </p>
          <p className="text-gray-700">
            Correct: <span className="font-semibold">{totalCorrect}</span> / {testData.questions.length}
          </p>
          <p className="text-gray-700">
            Your Score: <span className="font-semibold">{parseFloat(testData.score).toFixed(2)}</span>
          </p>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-4">
        {testData.questions.map((question, index) => {
          const isCorrect = question.question_type === 'NAT'
            ? question.given_ans_text === question.options[0].option_text
            : question.options.some(opt => opt.selected && opt.is_correct);

          let answerDisplay = null;
          if (question.question_type === 'NAT') {
            answerDisplay = (
              <>
                <p className='text-lg'>
                  <span className="font-medium">Your Answer:</span> {question.given_ans_text || 'No answer'}
                </p>
                <p className='text-lg'>
                  <span className="font-medium">Correct Answer:</span> {question.options[0].option_text}
                </p>
              </>
            );
          }

          return (
            <div key={question.question_id} className="bg-white shadow rounded p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    Q{index + 1}. {question.question_text}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Section: {question.section} | Type: {question.question_type} |
                    Marks: +{question.positive_marks}/-{question.negative_marks}
                  </p>
                </div>
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              {question.image_url && (
                <img src={question.image_url} alt="Question" className="mt-2 max-w-full h-auto" />
              )}

              {question.question_type !== 'NAT' && (
                <div className="mt-2">
                  <h3 className="font-medium mb-1">Options:</h3>
                  <ul className="mt-2 space-y-1">
                    {question.options.map(option => (
                      <li
                        key={option.option_id}
                        className={getOptionClasses(option, question.question_type)}
                      >
                        {option.option_text}
                        {option.image_url && (
                          <img src={option.image_url} alt="Option" className="mt-1 max-w-full h-auto" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {answerDisplay && (
                <div className="mt-2 text-gray-700">{answerDisplay}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentResponse;

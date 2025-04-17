import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Instructions = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get test_id from navigation state
  const test_id = location.state?.test_id;

  const handleStartTest = () => {
    if (agreed && test_id) {
      // Redirect to /submittest with test_id in state
      navigate('/submittest', { state: { test_id } });
    }
  };
  return (
    <div className="min-h-scree  flex items-center justify-center mt-4 ">
      <div className="w-full max-w-7xl bg-white rounded-md shadow p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Instructions for the Contest
          </h1>
          <p className="text-gray-600 text-sm">
            Please read the following instructions carefully before starting the test
          </p>
        </div>

        {/* Instructions Body */}
        <div className="space-y-4">
          {/* 1.0 Section */}
          <div className="space-y-2">
            <h2 className="font-semibold text-gray-700">1.0) Instructions</h2>
            <p className="text-sm text-gray-600">
              To answer a question, the candidates need to choose one option corresponding
              to the correct or the most appropriate answer. However, if any anomaly or
              discrepancy is found in the process of challenge or the key verification,
              it shall be addressed in the following manner:
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li><strong>Correct answer:</strong> +4</li>
              <li><strong>Incorrect option:</strong> -1</li>
              <li><strong>Unanswered / Marked for Review / Blank:</strong> 0</li>
              <li>
                All correct options will be taken into consideration for the total marks. 
                (+4) will be awarded to all who have marked any of the correct options.
              </li>
            </ul>
            <p className="text-sm text-gray-600">
              Although sufficient care will be taken for the correctness of questions, 
              in the event that a question(s) needs to be dropped, full marks for that 
              question(s) will be awarded to <em>all</em> candidates.
            </p>
          </div>

          {/* 2.0 Section */}
          <div className="space-y-2">
            <h2 className="font-semibold text-gray-700">2.0) Instructions</h2>
            <p className="text-sm text-gray-600">
              To answer a question, the candidates need to choose one option corresponding
              to the correct or the most appropriate answer. However, if any anomaly or
              discrepancy is found in the process of challenge or the key verification,
              it shall be addressed in the following manner:
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li><strong>Correct answer:</strong> +4</li>
              <li><strong>Incorrect option:</strong> -1</li>
              <li><strong>Unanswered / Marked for Review / Blank:</strong> 0</li>
              <li>
                All correct options will be taken into consideration for the total marks. 
                (+4) will be awarded to all who have marked any of the correct options.
              </li>
            </ul>
            <p className="text-sm text-gray-600">
              Although sufficient care will be taken for the correctness of questions, 
              in the event that a question(s) needs to be dropped, full marks for that 
              question(s) will be awarded to <em>all</em> candidates.
            </p>
          </div>
        </div>

        {/* Terms & Conditions + Start Button */}
        <div className="space-y-4">
          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-indigo-600"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>You agree to our Terms &amp; Conditions</span>
          </label>

          <button
            type="button"
            className={`px-5 py-2 rounded-md text-white transition-colors
              ${agreed ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
            onClick={handleStartTest}
            disabled={!agreed}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instructions;

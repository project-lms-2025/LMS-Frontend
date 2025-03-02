import React from 'react';

const StudentResponse = () => {
  // Dummy data for demonstration
  const questionPaper = {
    title: 'Sample Test',
    totalMarks: 3,
    questions: [
      {
        id: 1,
        type: 'MCQ',
        section: 'GA',
        text: 'What is the capital of France?',
        options: ['Berlin', 'Paris', 'Rome', 'Madrid'],
        correctAnswer: 1,        // Index 1 (Paris) is correct
        studentAnswer: 1,        // Student selected Paris
        marks: 1,
        incorrectMarks: 0.33,
        status: 'Answered',
      },
      {
        id: 2,
        type: 'MSQ',
        section: 'Subject',
        text: 'Select the prime numbers:',
        options: ['2', '3', '4', '6'],
        correctAnswers: [0, 1],  // '2' and '3' are correct
        studentAnswers: [0, 2],  // Student selected '2' and '4'
        marks: 1,
        incorrectMarks: 0,
        status: 'Answered',
      },
      {
        id: 3,
        type: 'NAT',
        section: 'GA',
        text: 'Solve: 2 + 2 = ?',
        correctAnswerText: '4',
        studentAnswerText: '4',
        marks: 1,
        incorrectMarks: 0,
        status: 'Answered',
      },
    ],
  };

  // Score calculation variables
  let totalScore = 0;
  let totalCorrect = 0;
  let totalAttempted = 0;

  // Evaluate a question's correctness and score.
  const evaluateQuestion = (q) => {
    let isCorrect = false;
    let scored = 0;
    if (q.type === 'MCQ' && q.studentAnswer !== null && q.studentAnswer !== undefined) {
      totalAttempted++;
      if (q.studentAnswer === q.correctAnswer) {
        isCorrect = true;
        scored = q.marks;
      } else {
        scored = -q.incorrectMarks;
      }
    } else if (q.type === 'MSQ' && q.studentAnswers && q.studentAnswers.length > 0) {
      totalAttempted++;
      const sortedStudent = [...q.studentAnswers].sort();
      const sortedCorrect = q.correctAnswers ? [...q.correctAnswers].sort() : [];
      if (JSON.stringify(sortedStudent) === JSON.stringify(sortedCorrect)) {
        isCorrect = true;
        scored = q.marks;
      } else {
        scored = -q.incorrectMarks;
      }
    } else if (q.type === 'NAT' && q.studentAnswerText !== undefined) {
      totalAttempted++;
      if (q.studentAnswerText.trim() === q.correctAnswerText?.trim()) {
        isCorrect = true;
        scored = q.marks;
      } else {
        scored = -q.incorrectMarks;
      }
    }
    return { isCorrect, scored };
  };

  // Process each question for overall score
  questionPaper.questions.forEach((q) => {
    const { isCorrect, scored } = evaluateQuestion(q);
    if (isCorrect) totalCorrect++;
    totalScore += scored;
  });

  // Helper functions to extract answer texts for MCQ and MSQ
  const getMCQAnswers = (q) => {
    const correct = q.correctAnswer !== undefined ? q.options[q.correctAnswer] : '';
    const student = (q.studentAnswer !== null && q.studentAnswer !== undefined)
      ? q.options[q.studentAnswer]
      : '';
    return { correct, student };
  };

  const getMSQAnswers = (q) => {
    const correct = q.correctAnswers ? q.correctAnswers.map(i => q.options[i]).join(', ') : '';
    const student = q.studentAnswers ? q.studentAnswers.map(i => q.options[i]).join(', ') : '';
    return { correct, student };
  };

  // Returns Tailwind CSS classes for an option based on whether it's correct and/or selected.
  const getOptionClasses = (isCorrect, isSelected) => {
    let bgClass = 'bg-white';
    if (isCorrect) {
      bgClass = 'bg-green-200';
    }
    if (isSelected && !isCorrect) {
      bgClass = 'bg-red-200';
    }
    const borderClass = isSelected ? 'border-2 border-blue-500' : '';
    return `${bgClass} ${borderClass} p-2 rounded`;
  };

  return (
    <div className="p-6 w-full mx-auto space-y-6 bg-gray-50">
      {/* Header Summary */}
      <div className="bg-white shadow rounded p-4 lg:flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{questionPaper.title}</h1>
          <p className="text-sm font-semibold text-gray-600">
            Total Questions: {questionPaper.questions.length} | Total Marks: {questionPaper.totalMarks}
          </p>
        </div>
        <div className="flex flex-col lg:items-end mt-2 lg:mt-0">
          <p className="text-gray-700">
            Attempted: <span className="font-semibold">{totalAttempted}</span> / {questionPaper.questions.length}
          </p>
          <p className="text-gray-700">
            Correct: <span className="font-semibold">{totalCorrect}</span> / {questionPaper.questions.length}
          </p>
          <p className="text-gray-700">
            Your Score: <span className="font-semibold">{totalScore.toFixed(2)}</span> / {questionPaper.totalMarks}
          </p>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-4">
        {questionPaper.questions.map((q) => {
          const { isCorrect } = evaluateQuestion(q);
          let answerDisplay = null;
          let optionsDisplay = null;

          if (q.type === 'MCQ') {
            const { correct, student } = getMCQAnswers(q);
            answerDisplay = (
              <>
                <p>
                  {/* <span className="font-medium">Your Answer:</span> {student || 'No answer'} */}
                </p>
                <p>
                  {/* <span className="font-medium">Correct Answer:</span> {correct} */}
                </p>
              </>
            );
            // Render options with coloring:
            optionsDisplay = (
              <ul className="mt-2 space-y-1">
                {q.options.map((opt, idx) => {
                  const isOptCorrect = idx === q.correctAnswer;
                  const isOptSelected = idx === q.studentAnswer;
                  return (
                    <li key={idx} className={getOptionClasses(isOptCorrect, isOptSelected)}>
                      {opt}
                    </li>
                  );
                })}
              </ul>
            );
          } else if (q.type === 'MSQ') {
            const { correct, student } = getMSQAnswers(q);
            answerDisplay = (
              <>
                <p>
                  {/* <span className="font-medium">Your Answers:</span> {student || 'No answers'} */}
                </p>
                <p>
                  {/* <span className="font-medium">Correct Answers:</span> {correct} */}
                </p>
              </>
            );
            // Render options for MSQ; for each option, determine if it is correct and/or selected.
            optionsDisplay = (
              <ul className="mt-2 space-y-1">
                {q.options.map((opt, idx) => {
                  const isOptCorrect = q.correctAnswers && q.correctAnswers.includes(idx);
                  const isOptSelected = q.studentAnswers && q.studentAnswers.includes(idx);
                  return (
                    <li key={idx} className={getOptionClasses(isOptCorrect, isOptSelected)}>
                      {opt}
                    </li>
                  );
                })}
              </ul>
            );
          } else if (q.type === 'NAT') {
            answerDisplay = (
              <>
                <p className='text-lg' >
                  <span className="font-medium ">Your Answer:</span> {q.studentAnswerText || 'No answer'}
                </p>
                <p className='text-lg' >
                  <span className="font-medium">Correct Answer:</span> {q.correctAnswerText}
                </p>
              </>
            );
          }

          return (
            <div key={q.id} className="bg-white shadow rounded p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  Q{q.id}. {q.text}
                </h2>
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                  {isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              <div className="mt-2 text-gray-700 text-sm">{answerDisplay}</div>
              {optionsDisplay && (
                <div className="mt-2">
                  <h3 className="font-medium mb-1">Options:</h3>
                  {optionsDisplay}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentResponse;

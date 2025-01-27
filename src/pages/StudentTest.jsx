import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { TestList } from '../components/TestList';
import { TestWindow } from '../components/TestWindow';


function StudentTest() {
    const [tests, setTests] = useState([
        {
          id: '1',
          title: 'Mid-Term Mathematics',
          subject: 'Mathematics',
          startTime: new Date(Date.now() - 1000 * 60 * 30),
          endTime: new Date(Date.now() + 1000 * 60 * 30),
          duration: 20,
          status: 'active',
          questions: [
            {
              id: 'q1',
              text: 'What is 2 + 2?',
              options: ['3', '4', '5', '6'],
              correctAnswer: 1,
              explanation: 'Basic addition: 2 + 2 = 4',
            },
            {
              id: 'q2',
              text: 'Solve for x: 3x + 5 = 14',
              options: ['3', '4', '5', '6'],
              correctAnswer: 0,
              explanation: 'Rearrange the equation: 3x = 9, so x = 3.',
            },
          ],
        },
        {
          id: '2',
          title: 'Physics Quiz',
          subject: 'Physics',
          startTime: new Date(Date.now() + 1000 * 60 * 60),
          endTime: new Date(Date.now() + 1000 * 60 * 120),
          duration: 30,
          status: 'upcoming',
          questions: [
            {
              id: 'q1',
              text: 'What is the unit of force?',
              options: ['Newton', 'Joule', 'Pascal', 'Watt'],
              correctAnswer: 0,
              explanation: 'Force is measured in Newtons.',
            },
            {
              id: 'q2',
              text: 'What is the acceleration due to gravity on Earth?',
              options: ['8.9 m/s²', '9.8 m/s²', '10 m/s²', '9.2 m/s²'],
              correctAnswer: 1,
              explanation: 'The standard value of g is 9.8 m/s².',
            },
          ],
        },
        {
          id: '3',
          title: 'Chemistry Test',
          subject: 'Chemistry',
          startTime: new Date(Date.now() - 1000 * 60 * 120),
          endTime: new Date(Date.now() - 1000 * 60 * 60),
          duration: 45,
          status: 'missed',
          questions: [
            {
              id: 'q1',
              text: 'What is the chemical symbol for water?',
              options: ['H2', 'O2', 'H2O', 'CO2'],
              correctAnswer: 2,
              explanation: 'Water is represented by the formula H2O.',
            },
            {
              id: 'q2',
              text: 'Which of these is a noble gas?',
              options: ['Oxygen', 'Hydrogen', 'Helium', 'Nitrogen'],
              correctAnswer: 2,
              explanation: 'Helium is a noble gas in Group 18 of the periodic table.',
            },
          ],
        },
        {
          id: '4',
          title: 'History Final Exam',
          subject: 'History',
          startTime: new Date(Date.now() + 1000 * 60 * 180),
          endTime: new Date(Date.now() + 1000 * 60 * 240),
          duration: 60,
          status: 'upcoming',
          questions: [
            {
              id: 'q1',
              text: 'Who was the first President of the United States?',
              options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'],
              correctAnswer: 1,
              explanation: 'George Washington was the first President of the United States.',
            },
            {
              id: 'q2',
              text: 'In which year did World War II end?',
              options: ['1945', '1939', '1942', '1950'],
              correctAnswer: 0,
              explanation: 'World War II ended in 1945.',
            },
          ],
        },
        {
          id: '5',
          title: 'Geography Assessment',
          subject: 'Geography',
          startTime: new Date(Date.now() - 1000 * 60 * 240),
          endTime: new Date(Date.now() - 1000 * 60 * 180),
          duration: 40,
          status: 'missed',
          questions: [
            {
              id: 'q1',
              text: 'What is the largest desert in the world?',
              options: ['Sahara', 'Gobi', 'Arctic', 'Antarctic'],
              correctAnswer: 3,
              explanation: 'The Antarctic Desert is the largest desert in the world.',
            },
            {
              id: 'q2',
              text: 'Which is the longest river in the world?',
              options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
              correctAnswer: 1,
              explanation: 'The Nile is considered the longest river in the world.',
            },
          ],
        },
        {
          id: '6',
          title: 'Biology Test',
          subject: 'Biology',
          startTime: new Date(Date.now() + 1000 * 60 * 300),
          endTime: new Date(Date.now() + 1000 * 60 * 360),
          duration: 50,
          status: 'upcoming',
          questions: [
            {
              id: 'q1',
              text: 'What is the powerhouse of the cell?',
              options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Apparatus'],
              correctAnswer: 2,
              explanation: 'Mitochondria are known as the powerhouse of the cell.',
            },
            {
              id: 'q2',
              text: 'What is the process by which plants make food?',
              options: ['Respiration', 'Digestion', 'Photosynthesis', 'Fermentation'],
              correctAnswer: 2,
              explanation: 'Plants use photosynthesis to convert light into food.',
            },
          ],
        },
      ]);
      

  const [activeTest, setActiveTest] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const sortedTests = [...tests].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    setTests(sortedTests);
  }, []);

  useEffect(() => {
    if (activeTest && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeTest, timeRemaining]);

  const startTest = (test) => {
    setActiveTest(test);
    setTimeRemaining(test.duration * 60);
    setUserAnswers([]);
    setIsFullscreen(true);
    document.documentElement.requestFullscreen();
  };

  const submitTest = () => {
    if (!activeTest) return;

    const score = calculateScore();
    const updatedTests = tests.map(test => 
      test.id === activeTest.id 
        ? { ...test, status: 'completed', score } 
        : test
    );

    setTests(updatedTests);
    setActiveTest(null);
    setIsFullscreen(false);
    document.exitFullscreen();

    setTimeout(() => {
      setShowResults(true);
    }, activeTest.duration * 60 * 1000);
  };

  const calculateScore = () => {
    if (!activeTest) return 0;
    
    let correct = 0;
    userAnswers.forEach(answer => {
      const question = activeTest.questions.find(q => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.selectedOption) {
        correct++;
      }
    });
    
    return (correct / activeTest.questions.length) * 100;
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setUserAnswers(prev => {
      const existing = prev.findIndex(a => a.questionId === questionId);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = { questionId, selectedOption: optionIndex };
        return updated;
      }
      return [...prev, { questionId, selectedOption: optionIndex }];
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (activeTest) {
    return (
      <TestWindow
        test={activeTest}
        timeRemaining={timeRemaining}
        userAnswers={userAnswers}
        onAnswerSelect={handleAnswerSelect}
        onSubmit={submitTest}
        formatTime={formatTime}
      />
    );
  }

  return (
    <>
      <TestList
        tests={tests}
        onStartTest={startTest}
        onViewResults={() => setShowResults(true)}
        formatDateTime={formatDateTime}
      />

      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Results</h2>
            <div className="space-y-6">
              {activeTest?.questions.map((question, index) => {
                const userAnswer = userAnswers.find(a => a.questionId === question.id);
                const isCorrect = userAnswer?.selectedOption === question.correctAnswer;
                
                return (
                  <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-1" />
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">
                          {index + 1}. {question.text}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                          Your answer: {question.options[userAnswer?.selectedOption || 0]}
                        </p>
                        <p className="text-sm text-gray-600">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-gray-600 mt-2">
                            Explanation: {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowResults(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StudentTest;

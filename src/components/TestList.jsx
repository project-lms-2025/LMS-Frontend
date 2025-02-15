import React from 'react';
import { 
  Clock, 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  Eye,
  ArrowLeftRight
} from 'lucide-react';

export function TestList({ tests, onStartTest, onViewResults, formatDateTime }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'upcoming':
        return 'text-blue-500';
      case 'completed':
        return 'text-gray-500';
      case 'missed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Clock className="w-5 h-5" />;
      case 'upcoming':
        return <ClipboardList className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'missed':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary-gray dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-primary-white">
          My Tests
        </h1>
        
      </div>
  
      <div className="bg-primary-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {tests.map((test) => (
            <div
              key={test.id}
              className="p-6 hover:bg-secondary-gray dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`${getStatusColor(test.status)}`}>
                    {getStatusIcon(test.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-primary-white">
                      {test.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {test.subject}
                    </p>
                  </div>
                </div>
  
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-primary-white">
                      {formatDateTime(test.startTime)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Duration: {test.duration} mins
                    </p>
                  </div>
  
                  {test.status === "active" && (
                    <button
                      onClick={() => onStartTest(test)}
                      className="flex items-center px-4 py-2 bg-primary-purple text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      Start Test
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
  
                  {test.status === "completed" && (
                    <button
                      onClick={onViewResults}
                      className="flex items-center px-4 py-2 bg-secondary-coral text-white rounded-lg hover:bg-red-500 transition-colors duration-200"
                    >
                      View Results
                      <Eye className="w-4 h-4 ml-2" />
                    </button>
                  )}
  
                  {test.status === "missed" && (
                    <button
                      onClick={() => onStartTest(test)}
                      className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      Retake Test
                      <ArrowLeftRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  
  );
}

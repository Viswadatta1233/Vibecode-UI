import React from 'react';
import type { TestResult } from '../../types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestProgressProps {
  results: TestResult[];
}

const TestProgress: React.FC<TestProgressProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="mt-6 p-4 bg-leetcode-gray-50 dark:bg-leetcode-gray-800 rounded-lg border border-leetcode-gray-200 dark:border-leetcode-gray-700">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-leetcode-gray-400" />
          <span className="text-leetcode-gray-600 dark:text-leetcode-gray-300">Waiting for test results...</span>
        </div>
      </div>
    );
  }

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const progressPercentage = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;

  const getStatusIcon = (result: TestResult) => {
    if (result.error) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (result.passed) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = (result: TestResult) => {
    if (result.error) {
      return 'Runtime Error';
    }
    if (result.passed) {
      return 'Passed';
    }
    return 'Failed';
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Progress Bar */}
      <div className="bg-leetcode-gray-50 dark:bg-leetcode-gray-800 rounded-lg border border-leetcode-gray-200 dark:border-leetcode-gray-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-leetcode-gray-900 dark:text-white">
            Test Results
          </h3>
          <span className="text-sm text-leetcode-gray-600 dark:text-leetcode-gray-300">
            {passedCount}/{totalCount} passed
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-leetcode-gray-200 dark:bg-leetcode-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-leetcode-green h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-leetcode-gray-600 dark:text-leetcode-gray-300">
            Progress: {Math.round(progressPercentage)}%
          </span>
          <span className={`font-medium ${
            passedCount === totalCount 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {passedCount === totalCount ? 'All tests passed!' : `${totalCount - passedCount} test(s) failed`}
          </span>
        </div>
      </div>

      {/* Individual Test Results */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${
              result.passed 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(result)}
                <span className="font-medium text-leetcode-gray-900 dark:text-white">
                  Test Case {index + 1}
                </span>
              </div>
              <span className={`text-sm font-medium ${
                result.passed 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {getStatusText(result)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-leetcode-gray-700 dark:text-leetcode-gray-300">Input:</span>
                <div className="mt-1 p-2 bg-leetcode-gray-100 dark:bg-leetcode-gray-800 rounded font-mono text-xs">
                  {result.testcase.input}
                </div>
              </div>
              
              <div>
                <span className="font-semibold text-leetcode-gray-700 dark:text-leetcode-gray-300">Expected Output:</span>
                <div className="mt-1 p-2 bg-leetcode-gray-100 dark:bg-leetcode-gray-800 rounded font-mono text-xs">
                  {result.testcase.output}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <span className="font-semibold text-leetcode-gray-700 dark:text-leetcode-gray-300">Your Output:</span>
                <div className="mt-1 p-2 bg-leetcode-gray-100 dark:bg-leetcode-gray-800 rounded font-mono text-xs">
                  {result.output || 'No output'}
                </div>
              </div>
              
              {result.error && (
                <div className="md:col-span-2">
                  <span className="font-semibold text-red-600 dark:text-red-400">Error:</span>
                  <div className="mt-1 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded font-mono text-xs text-red-700 dark:text-red-300">
                    {result.error}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestProgress; 
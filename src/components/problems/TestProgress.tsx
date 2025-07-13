import React from 'react';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import type { TestResult } from '../../types';

interface TestProgressProps {
  results: TestResult[];
  totalTestCases: number;
  status: string;
}

const TestProgress: React.FC<TestProgressProps> = ({ results, totalTestCases, status }) => {
  const { theme } = useTheme();
  
  // Calculate progress
  const completedTests = results.length;
  const passedTests = results.filter(result => result.passed).length;
  const failedTests = results.filter(result => !result.passed).length;
  const pendingTests = totalTestCases - completedTests;

  // Calculate percentage for progress bar
  const progressPercentage = (completedTests / totalTestCases) * 100;

  // Get status color and text
  const getStatusInfo = () => {
    if (status === 'Running' || status === 'Pending') {
      return {
        color: 'text-leetcode-yellow',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-700',
        icon: <Loader2 className="h-5 w-5 text-leetcode-yellow animate-spin" />
      };
    } else if (status === 'Success' || passedTests === totalTestCases) {
      return {
        color: 'text-leetcode-green',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-700',
        icon: <CheckCircle className="h-5 w-5 text-leetcode-green" />
      };
    } else {
      return {
        color: 'text-leetcode-red',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-700',
        icon: <XCircle className="h-5 w-5 text-leetcode-red" />
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`bg-white dark:bg-leetcode-gray-800 border ${statusInfo.borderColor} rounded-lg p-4 ${statusInfo.bgColor} transition-colors duration-200`}>
      {/* Header with Progress */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-leetcode-gray-900 dark:text-white">Test Progress</h3>
        <div className="flex items-center space-x-2">
          {statusInfo.icon}
          <span className={`text-sm font-medium ${statusInfo.color}`}>
            {status === 'Running' || status === 'Pending' 
              ? `${passedTests}/${totalTestCases} Passed`
              : status === 'Success' 
                ? 'All Tests Passed!'
                : `${passedTests}/${totalTestCases} Passed`
            }
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-leetcode-gray-600 dark:text-leetcode-gray-300 mb-1">
          <span>Progress: {completedTests}/{totalTestCases} completed</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-leetcode-gray-200 dark:bg-leetcode-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              status === 'Success' || passedTests === totalTestCases 
                ? 'bg-leetcode-green' 
                : failedTests > 0 
                  ? 'bg-leetcode-red' 
                  : 'bg-leetcode-yellow'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Test Case Results */}
      <div className="space-y-2">
        {/* Completed Tests */}
        {results.map((result, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white dark:bg-leetcode-gray-700 rounded border border-leetcode-gray-200 dark:border-leetcode-gray-600">
              <span className="text-sm text-leetcode-gray-700 dark:text-leetcode-gray-300">Test Case {index + 1}</span>
              <div className="flex items-center space-x-2">
                {result.passed ? (
                  <CheckCircle className="h-4 w-4 text-leetcode-green" />
                ) : (
                  <XCircle className="h-4 w-4 text-leetcode-red" />
                )}
                <span className={`text-sm font-medium ${result.passed ? 'text-leetcode-green' : 'text-leetcode-red'}`}>
                  {result.passed ? 'Passed' : 'Failed'}
                </span>
                {result.executionTime && (
                  <span className="text-xs text-leetcode-gray-500 dark:text-leetcode-gray-400">
                    {result.executionTime}ms
                  </span>
                )}
              </div>
            </div>
            
            {/* Error Message Display */}
            {result.error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
                <div className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-leetcode-red mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Runtime Error</h4>
                    <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap font-mono bg-red-100 dark:bg-red-900/30 p-2 rounded border border-red-200 dark:border-red-700">
                      {result.error}
                    </pre>
                  </div>
                </div>
              </div>
            )}
            
            {/* Output Comparison for Failed Tests */}
            {!result.passed && !result.error && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
                <div className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-leetcode-yellow mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Wrong Answer</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-medium text-yellow-700 dark:text-yellow-300">Your Output:</span>
                        <pre className="mt-1 text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded border border-yellow-200 dark:border-yellow-700 font-mono">
                          {result.output || '(empty)'}
                        </pre>
                      </div>
                      <div>
                        <span className="font-medium text-yellow-700 dark:text-yellow-300">Expected Output:</span>
                        <pre className="mt-1 text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded border border-yellow-200 dark:border-yellow-700 font-mono">
                          {result.expected || result.testcase.output}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Pending Tests */}
        {Array.from({ length: pendingTests }, (_, index) => (
          <div key={`pending-${index}`} className="flex items-center justify-between p-2 bg-leetcode-gray-50 dark:bg-leetcode-gray-700 rounded border border-dashed border-leetcode-gray-300 dark:border-leetcode-gray-600">
            <span className="text-sm text-leetcode-gray-500 dark:text-leetcode-gray-400">Test Case {completedTests + index + 1}</span>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-leetcode-gray-400" />
              <span className="text-sm text-leetcode-gray-500 dark:text-leetcode-gray-400">Pending</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-leetcode-gray-200 dark:border-leetcode-gray-600">
        <div className="flex justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-leetcode-green" />
              <span className="text-leetcode-green">{passedTests} Passed</span>
            </div>
            {failedTests > 0 && (
              <div className="flex items-center space-x-1">
                <XCircle className="h-3 w-3 text-leetcode-red" />
                <span className="text-leetcode-red">{failedTests} Failed</span>
              </div>
            )}
            {pendingTests > 0 && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-leetcode-gray-400" />
                <span className="text-leetcode-gray-500 dark:text-leetcode-gray-400">{pendingTests} Pending</span>
              </div>
            )}
          </div>
          <span className="font-medium text-leetcode-gray-700 dark:text-leetcode-gray-300">
            {passedTests}/{totalTestCases}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestProgress; 
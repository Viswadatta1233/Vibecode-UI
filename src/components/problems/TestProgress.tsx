import React from 'react';
import type { TestResult } from '../../types';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestProgressProps {
  results: TestResult[];
  percentage?: number;
  passedCount?: number;
  totalCount?: number;
  status?: string;
}

const TestProgress: React.FC<TestProgressProps> = ({ results, percentage, passedCount: propPassedCount, totalCount: propTotalCount, status }) => {
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

  // Use props if available, otherwise calculate from results
  const finalPassedCount = propPassedCount ?? results.filter(r => r.passed).length;
  const finalTotalCount = propTotalCount ?? results.length;
  
  // Calculate percentage based on completed tests only when status is Running
  let finalPercentage = percentage ?? 0;
  if (status === 'Running' && !percentage) {
    // When running, only count completed tests for percentage
    const completedTests = results.filter(r => r.passed !== undefined);
    const completedPassed = completedTests.filter(r => r.passed).length;
    finalPercentage = completedTests.length > 0 ? (completedPassed / completedTests.length) * 100 : 0;
  } else if (!percentage) {
    finalPercentage = finalTotalCount > 0 ? (finalPassedCount / finalTotalCount) * 100 : 0;
  }

  const getStatusIcon = (result: TestResult, status: string) => {
    // If test hasn't been processed yet (no output and no error), show processing
    if (status === 'Running' && result.output === '' && !result.error && result.passed === false) {
      return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
    }
    if (result.error) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    if (result.passed) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = (result: TestResult, status: string) => {
    // If test hasn't been processed yet, show processing
    if (status === 'Running' && result.output === '' && !result.error && result.passed === false) {
      return 'Processing';
    }
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
            {finalPassedCount}/{finalTotalCount} passed
          </span>
        </div>
        
        {/* Overall Score Display */}
        <div className="mb-4 p-3 bg-leetcode-gray-100 dark:bg-leetcode-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-leetcode-gray-700 dark:text-leetcode-gray-300">
              Overall Score:
            </span>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${
                finalPercentage === 100 ? 'text-green-600' :
                finalPercentage >= 60 ? 'text-yellow-600' :
                finalPercentage > 0 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {Math.round(finalPercentage)}%
              </span>
              <span className="text-sm text-leetcode-gray-500 dark:text-leetcode-gray-400">
                ({finalPassedCount}/{finalTotalCount})
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-2 w-full bg-leetcode-gray-200 dark:bg-leetcode-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                finalPercentage === 100 ? 'bg-green-500' :
                finalPercentage >= 60 ? 'bg-yellow-500' :
                finalPercentage > 0 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${finalPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-leetcode-gray-600 dark:text-leetcode-gray-300">
            Status: {status || 'Completed'}
          </span>
          <span className={`font-medium ${
            status === 'Running' 
              ? 'text-blue-600 dark:text-blue-400'
              : finalPassedCount === finalTotalCount 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
          }`}>
            {status === 'Running' 
              ? `${finalPassedCount} passed`
              : finalPassedCount === finalTotalCount 
                ? 'All tests passed!' 
                : `${finalTotalCount - finalPassedCount} test(s) failed`
            }
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
                 {getStatusIcon(result, status || '')}
                 <span className="font-medium text-leetcode-gray-900 dark:text-white">
                   Test Case {index + 1}
                 </span>
               </div>
               <span className={`text-sm font-medium ${
                 status === 'Running' && result.output === '' && !result.error && result.passed === false
                   ? 'text-blue-600 dark:text-blue-400'
                   : result.passed 
                     ? 'text-green-600 dark:text-green-400' 
                     : 'text-red-600 dark:text-red-400'
               }`}>
                 {getStatusText(result, status || '')}
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
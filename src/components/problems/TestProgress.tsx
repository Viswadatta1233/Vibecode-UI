import React from 'react';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import type { TestResult } from '../../types';

interface TestProgressProps {
  results: TestResult[];
  totalTestCases: number;
  status: string;
}

const TestProgress: React.FC<TestProgressProps> = ({ results, totalTestCases, status }) => {
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
    <div>
      {/* Render test progress here */}
    </div>
  );
};

export default TestProgress; 
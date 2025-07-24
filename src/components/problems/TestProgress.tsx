import React from 'react';

interface TestProgressProps {
  completed: number;
  total: number;
}

const TestProgress: React.FC<TestProgressProps> = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-leetcode-gray-600 dark:text-leetcode-gray-400 mb-2">
        <span>Test Progress</span>
        <span>{completed}/{total} completed</span>
      </div>
      <div className="w-full bg-leetcode-gray-200 dark:bg-leetcode-gray-700 rounded-full h-2">
        <div 
          className="bg-leetcode-green h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TestProgress; 
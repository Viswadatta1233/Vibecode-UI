import React from 'react';
import type { TestResult } from '../../types';

interface TestProgressProps {
  results: TestResult[];
}

const TestProgress: React.FC<TestProgressProps> = () => {
  return (
    <div>
      {/* Render test progress here */}
    </div>
  );
};

export default TestProgress; 
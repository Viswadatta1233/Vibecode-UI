import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { problemAPI, submissionAPI } from '../../services/api';
import { Play, ArrowLeft } from 'lucide-react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Link } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import TestProgress from './TestProgress';
import type { Problem, Submission } from '../../types';
import { toast } from 'react-hot-toast';

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('JAVA');
  const [userCode, setUserCode] = useState('');
  const [submission, setSubmission] = useState<Submission | null>(null);

  // Memoized callback to prevent unnecessary re-renders
  const handleSubmissionUpdate = useCallback((submissionId: string, data: any) => {
    setSubmission(prev => {
      if (prev && prev._id === submissionId) {
        if (data.status === 'Running' && data.results) {
          const completedCount = data.results.length;
          const totalCount = problem?.testcases.length || 0;
          if (completedCount > 0 && totalCount > 0) {
            const passedCount = data.results.filter((r: any) => r.passed).length;
            const progressText = `${passedCount}/${completedCount} passed (${completedCount}/${totalCount} completed)`;
            toast.loading(`Running tests... ${progressText}`, { 
              id: submissionId,
              duration: 2000
            });
          }
          return {
            ...prev,
            status: data.status,
            results: data.results || prev.results
          } as Submission;
        }
        toast.success('🎉 All test cases passed!', { id: submissionId });
        return {
          ...prev,
          status: data.status,
          results: data.results || prev.results
        } as Submission;
      } else if (prev && (data.status === 'Failed' || data.status === 'WA' || data.status === 'RE' || data.status === 'TLE')) {
        const passedCount = data.results?.filter((r: any) => r.passed).length || 0;
        const totalCount = data.results?.length || 0;
        toast.error(`❌ Tests failed: ${passedCount}/${totalCount} passed`, { id: submissionId });
        return {
          ...prev,
          status: data.status,
          results: data.results || prev.results
        } as Submission;
      }
      return prev;
    });
  }, [problem]);

  // WebSocket hook for real-time updates
  useWebSocket(handleSubmissionUpdate);

  useEffect(() => {
    if (id) {
      fetchProblem();
    }
  }, [id]);

  const fetchProblem = async () => {
    try {
      if (!id) return;
      const data = await problemAPI.getProblemById(id);
      setProblem(data);
      const defaultStub = data.codeStubs.find(stub => stub.language === selectedLanguage);
      if (defaultStub) {
        const fullCode = defaultStub.startSnippet + '\n' + defaultStub.userSnippet + '\n' + defaultStub.endSnippet;
        setUserCode(fullCode);
      }
    } catch (error) {
      // setError('Failed to load problem'); // This line was removed as per the edit hint
    } finally {
      // setLoading(false); // This line was removed as per the edit hint
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    if (problem) {
      const stub = problem.codeStubs.find(s => s.language === language);
      if (stub) {
        const fullCode = stub.startSnippet + '\n' + stub.userSnippet + '\n' + stub.endSnippet;
        setUserCode(fullCode);
      }
    }
  };

  const handleSubmit = async () => {
    if (!problem || !id) return;
    setSubmitting(true);
    
    try {
      const stub = problem.codeStubs.find(s => s.language === selectedLanguage);
      if (!stub) {
        toast.error('No code stub found for selected language');
        return;
      }

      // Extract user code from the full code
      const startSnippetIndex = userCode.indexOf(stub.startSnippet);
      const endSnippetIndex = userCode.lastIndexOf(stub.endSnippet);
      
      let codeToSubmit = userCode;
      if (startSnippetIndex !== -1 && endSnippetIndex !== -1) {
        const startOfUserCode = startSnippetIndex + stub.startSnippet.length;
        const endOfUserCode = endSnippetIndex;
        if (startOfUserCode < endOfUserCode) {
          codeToSubmit = userCode.substring(startOfUserCode, endOfUserCode).trim();
        }
      }

      console.log('Submitting code:', {
        problemId: id,
        language: selectedLanguage,
        codeLength: codeToSubmit.length
      });

      // Make the actual API call
      const submission = await submissionAPI.createSubmission({
        problemId: id,
        userCode: codeToSubmit,
        language: selectedLanguage
      });

      console.log('Submission created:', submission);
      setSubmission(submission);
      toast.success('Code submitted successfully!');
      
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-leetcode-gray-50 dark:bg-leetcode-gray-900 px-4 md:px-8 py-8 transition-colors duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Problem Description Card */}
        <div className="bg-white dark:bg-leetcode-gray-800 rounded-xl shadow-lg border border-leetcode-gray-200 dark:border-leetcode-gray-700 p-8 mb-6">
          <Link to="/problems" className="flex items-center text-leetcode-green hover:underline mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Problems
          </Link>
          <h2 className="text-2xl font-bold text-leetcode-gray-900 dark:text-white mb-2">{problem?.title}</h2>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${problem?.difficulty ? '' : ''} mb-4 inline-block`}>
            {problem?.difficulty}
          </span>
          <p className="text-leetcode-gray-700 dark:text-leetcode-gray-300 mb-4 whitespace-pre-line">
            {problem?.description}
          </p>
          {/* Test Cases */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-leetcode-gray-900 dark:text-white mb-2">Sample Test Cases</h3>
            <div className="space-y-2">
              {(problem?.testcases ?? []).length > 0 ? (
                (problem?.testcases ?? []).map((tc, idx) => (
                  <div key={idx} className="bg-leetcode-gray-100 dark:bg-leetcode-gray-900 border border-leetcode-gray-200 dark:border-leetcode-gray-700 rounded-md px-4 py-2 text-sm text-leetcode-gray-700 dark:text-leetcode-gray-300">
                    <div><span className="font-semibold">Input:</span> <span className="font-mono">{tc.input}</span></div>
                    <div><span className="font-semibold">Output:</span> <span className="font-mono">{tc.output}</span></div>
                  </div>
                ))
              ) : (
                <div className="text-leetcode-gray-400">No test cases available.</div>
              )}
            </div>
          </div>
        </div>
        {/* Code Editor and Submission Card */}
        <div className="bg-white dark:bg-leetcode-gray-800 rounded-xl shadow-lg border border-leetcode-gray-200 dark:border-leetcode-gray-700 p-8 mb-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-leetcode-gray-900 dark:text-white">
              Solution
            </h2>
            <div className="flex items-center space-x-4">
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-1 border border-leetcode-gray-300 dark:border-leetcode-gray-600 rounded-md bg-white dark:bg-leetcode-gray-700 text-leetcode-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-leetcode-green focus:border-leetcode-green transition-colors"
              >
                <option value="JAVA">Java</option>
                <option value="CPP">C++</option>
                <option value="PYTHON">Python</option>
              </select>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center px-4 py-2 bg-leetcode-green hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-4 w-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
          <CodeEditor
            value={userCode}
            onChange={setUserCode}
            language={selectedLanguage}
          />
          {/* Test Results */}
          {submission && (
            <div className="mt-6 w-full max-w-6xl mx-auto">
              <TestProgress 
                results={submission.results || []} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail; 
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { problemAPI, submissionAPI } from '../../services/api';
import { Play, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import TestProgress from './TestProgress';
import type { Problem, Submission } from '../../types';
import { toast } from 'react-hot-toast';

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('JAVA');
  const [userCode, setUserCode] = useState('');
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  // Memoized callback to prevent unnecessary re-renders
  const handleSubmissionUpdate = useCallback((submissionId: string, data: any) => {
    console.log('🔄 Updating submission state:', submissionId, data);
    setSubmission(prev => {
      if (prev && prev._id === submissionId) {
        // Handle different types of updates
        if (data.status === 'Running' && data.results) {
          // Real-time test case updates
          console.log('📊 Real-time test case update:', data.results.length, 'test cases completed');
          
          // Show progress toast for each completed test case
          const completedCount = data.results.length;
          const totalCount = problem?.testcases.length || 0;
          
          if (completedCount > 0 && totalCount > 0) {
            const passedCount = data.results.filter((r: any) => r.passed).length;
            const progressText = `${passedCount}/${completedCount} passed (${completedCount}/${totalCount} completed)`;
            
            // Update toast with progress
            toast.loading(`Running tests... ${progressText}`, { 
              id: submissionId,
              duration: 2000
            });
          }
          
          return {
            ...prev,
            status: data.status,
            results: data.results || prev.results
          };
        } else if (data.status === 'Success') {
          // All tests completed successfully
          toast.success('🎉 All test cases passed!', { id: submissionId });
          return {
            ...prev,
            status: data.status,
            results: data.results || prev.results
          };
        } else if (data.status === 'Failed' || data.status === 'WA' || data.status === 'RE' || data.status === 'TLE') {
          // Tests failed
          const passedCount = data.results?.filter((r: any) => r.passed).length || 0;
          const totalCount = data.results?.length || 0;
          toast.error(`❌ Tests failed: ${passedCount}/${totalCount} passed`, { id: submissionId });
          return {
            ...prev,
            status: data.status,
            results: data.results || prev.results
          };
        } else {
          // General status update
          return {
            ...prev,
            status: data.status,
            results: data.results || prev.results
          };
        }
      }
      return prev;
    });
  }, []);

  // WebSocket hook for real-time updates
  const { isConnected } = useWebSocket(handleSubmissionUpdate);

  useEffect(() => {
    console.log('🎯 ProblemDetail component mounted/updated, id:', id);
    if (id) {
      fetchProblem();
    }
  }, [id]);

  const fetchProblem = async () => {
    try {
      if (!id) return;
      console.log('📡 Fetching problem:', id);
      const data = await problemAPI.getProblemById(id);
      setProblem(data);
      
      // Set default code for selected language
      const defaultStub = data.codeStubs.find(stub => stub.language === selectedLanguage);
      if (defaultStub) {
        // Combine startSnippet + userSnippet + endSnippet for display
        const fullCode = defaultStub.startSnippet + '\n' + defaultStub.userSnippet + '\n' + defaultStub.endSnippet;
        console.log('🔍 Initial Code Loading Debug:');
        console.log('📋 Start snippet:', defaultStub.startSnippet);
        console.log('📋 User snippet:', defaultStub.userSnippet);
        console.log('📋 End snippet:', defaultStub.endSnippet);
        console.log('📝 Full code to display:', fullCode);
        setUserCode(fullCode);
      }
    } catch (error) {
      console.error('❌ Failed to fetch problem:', error);
      setError('Failed to load problem');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    console.log('🔤 Language changed to:', language);
    setSelectedLanguage(language);
    if (problem) {
      const stub = problem.codeStubs.find(s => s.language === language);
      if (stub) {
        // Combine startSnippet + userSnippet + endSnippet for display
        const fullCode = stub.startSnippet + '\n' + stub.userSnippet + '\n' + stub.endSnippet;
        console.log('🔍 Language Change Debug:');
        console.log('📋 Start snippet:', stub.startSnippet);
        console.log('📋 User snippet:', stub.userSnippet);
        console.log('📋 End snippet:', stub.endSnippet);
        console.log('📝 Full code to display:', fullCode);
        setUserCode(fullCode);
      }
    }
  };

  const handleSubmit = async () => {
    if (!problem || !id) return;
    
    console.log('🚀 Submitting solution...');
    setSubmitting(true);
    setError('');
    
    try {
      // Extract only the user's code (userSnippet part)
      const stub = problem.codeStubs.find(s => s.language === selectedLanguage);
      let codeToSubmit = userCode;
      
      console.log('🔍 Frontend Code Extraction Debug:');
      console.log('📝 Current userCode in editor:', userCode);
      console.log('🔧 Selected language:', selectedLanguage);
      
      if (stub) {
        console.log('📋 Start snippet:', stub.startSnippet);
        console.log('📋 User snippet:', stub.userSnippet);
        console.log('📋 End snippet:', stub.endSnippet);
        
        // Try to extract the user code using multiple strategies
        let extracted = false;
        
        // Strategy 1: Try to find the exact snippets
        const startSnippetIndex = userCode.indexOf(stub.startSnippet);
        const endSnippetIndex = userCode.lastIndexOf(stub.endSnippet);
        
        console.log('🔍 Start snippet index:', startSnippetIndex);
        console.log('🔍 End snippet index:', endSnippetIndex);
        
        if (startSnippetIndex !== -1 && endSnippetIndex !== -1) {
          // Extract the part between startSnippet and endSnippet
          const startOfUserCode = startSnippetIndex + stub.startSnippet.length;
          const endOfUserCode = endSnippetIndex;
          
          console.log('🔍 Start of user code index:', startOfUserCode);
          console.log('🔍 End of user code index:', endOfUserCode);
          
          if (startOfUserCode < endOfUserCode) {
            codeToSubmit = userCode.substring(startOfUserCode, endOfUserCode).trim();
            console.log('✅ Successfully extracted user code (Strategy 1)');
            extracted = true;
          }
        }
        
        // Strategy 2: If exact matching failed, try to extract the function
        if (!extracted) {
          console.log('⚠️ Strategy 1 failed, trying Strategy 2...');
          
          // Look for the function signature
          const functionMatch = userCode.match(/vector<int>\s+twoSum\s*\([^)]*\)\s*\{[\s\S]*?\}/);
          if (functionMatch) {
            codeToSubmit = functionMatch[0].trim();
            console.log('✅ Successfully extracted user code (Strategy 2)');
            extracted = true;
          }
        }
        
        // Strategy 3: If function matching failed, try to extract between class and main
        if (!extracted) {
          console.log('⚠️ Strategy 2 failed, trying Strategy 3...');
          
          // For Java, try to extract the method from the class
          if (selectedLanguage === 'JAVA') {
            const classMatch = userCode.match(/class\s+Solution\s*\{[\s\S]*?\}/);
            if (classMatch) {
              codeToSubmit = classMatch[0].trim();
              console.log('✅ Successfully extracted user code (Strategy 3)');
              extracted = true;
            }
          }
        }
        
        // Strategy 4: If all else fails, use the userSnippet as fallback
        if (!extracted) {
          console.log('⚠️ All strategies failed, using userSnippet as fallback');
          codeToSubmit = stub.userSnippet;
        }
      }
      
      console.log('📤 Final code to submit:', codeToSubmit);
      
             const submissionData = await submissionAPI.createSubmission({
         problemId: id,
         userCode: codeToSubmit,
         language: selectedLanguage,
       });
      
      console.log('✅ Submission created:', submissionData);
      setSubmission(submissionData);
      
      // Show initial toast
      toast.loading('🚀 Submitting your solution...', { 
        id: submissionData._id,
        duration: 2000
      });
      
    } catch (err: any) {
      console.error('❌ Submission failed:', err);
      setError(err.response?.data?.message || 'Submission failed');
      toast.error('❌ Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-leetcode-green bg-green-100 dark:bg-green-900/20';
      case 'Medium':
        return 'text-leetcode-yellow bg-yellow-100 dark:bg-yellow-900/20';
      case 'Hard':
        return 'text-leetcode-red bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-leetcode-gray-600 dark:text-leetcode-gray-400 bg-leetcode-gray-100 dark:bg-leetcode-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="h-5 w-5 text-leetcode-green" />;
      case 'Failed':
      case 'WA':
      case 'RE':
      case 'TLE':
        return <XCircle className="h-5 w-5 text-leetcode-red" />;
      case 'Running':
        return <Clock className="h-5 w-5 text-leetcode-yellow animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-leetcode-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-leetcode-gray-50 dark:bg-leetcode-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-leetcode-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-leetcode-gray-50 dark:bg-leetcode-gray-900">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-leetcode-gray-500 dark:text-leetcode-gray-400 text-lg mb-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-leetcode-gray-50 dark:bg-leetcode-gray-900 px-4 md:px-8 py-8 transition-colors duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Problem Description Card */}
        <div className="bg-white dark:bg-leetcode-gray-800 rounded-xl shadow-lg border border-leetcode-gray-200 dark:border-leetcode-gray-700 p-8 mb-6">
          <Link to="/problems" className="flex items-center text-leetcode-green hover:underline mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Problems
          </Link>
          <h2 className="text-2xl font-bold text-leetcode-gray-900 dark:text-white mb-2">{problem?.title}</h2>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem?.difficulty || '')} mb-4 inline-block`}>
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
                totalTestCases={problem?.testcases?.length || 0} 
                status={submission.status} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail; 
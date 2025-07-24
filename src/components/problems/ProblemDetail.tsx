import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { problemAPI, submissionAPI } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';
import CodeEditor from './CodeEditor';
import TestProgress from './TestProgress';
import type { Problem, Submission } from '../../types';
import { Play, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<'JAVA' | 'PYTHON' | 'CPP'>('JAVA');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [submissionResults, setSubmissionResults] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchProblem(id);
    }
  }, [id]);

  useEffect(() => {
    if (problem && selectedLanguage) {
      const stub = problem.codeStubs?.find((stub: any) => stub.language === selectedLanguage);
      if (stub) {
        setCode(stub.userSnippet || '');
      }
    }
  }, [problem, selectedLanguage]);

  const { isConnected } = useWebSocket((submissionId: string, data: any) => {
    if (currentSubmission && submissionId === currentSubmission._id) {
      console.log('📨 Received submission update:', data);
      setSubmissionResults(data);
      
      if (data.status && ['Success', 'WA', 'RE', 'Failed'].includes(data.status)) {
        setSubmitting(false);
      }
    }
  });

  const fetchProblem = async (problemId: string) => {
    try {
      const data = await problemAPI.getProblemById(problemId);
      setProblem(data);
    } catch (error) {
      console.error('Failed to fetch problem:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem || !code.trim()) return;
    
    setSubmitting(true);
    setSubmissionResults(null);
    
    try {
      const submission = await submissionAPI.createSubmission({
        problemId: problem._id,
        code: code.trim(),
        language: selectedLanguage
      });
      
      setCurrentSubmission(submission);
      console.log('✅ Submission created:', submission._id);
    } catch (error) {
      console.error('❌ Submission failed:', error);
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'WA':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'RE':
      case 'Failed':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'Running':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'WA':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'RE':
      case 'Failed':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'Running':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage === 100) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage > 0) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-leetcode-green"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <p className="text-leetcode-gray-500 dark:text-leetcode-gray-400">Problem not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-leetcode-gray-50 dark:bg-leetcode-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="bg-white dark:bg-leetcode-gray-800 rounded-xl border border-leetcode-gray-200 dark:border-leetcode-gray-700 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-leetcode-gray-900 dark:text-white mb-4">
                {problem.title}
              </h1>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                problem.difficulty === 'easy' ? 'text-green-600 bg-green-100 dark:bg-green-900/20' :
                problem.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20' :
                'text-red-600 bg-red-100 dark:bg-red-900/20'
              }`}>
                {problem.difficulty}
              </span>
            </div>
            
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-leetcode-gray-700 dark:text-leetcode-gray-300 leading-relaxed">
                {problem.description}
              </p>
            </div>

            {/* Test Cases */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-leetcode-gray-900 dark:text-white">
                Example Test Cases
              </h3>
                             {problem.testcases?.slice(0, 2).map((testcase: any, index: number) => (
                <div key={index} className="bg-leetcode-gray-50 dark:bg-leetcode-gray-900 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-leetcode-gray-600 dark:text-leetcode-gray-400 mb-1">
                        Input:
                      </p>
                      <code className="text-sm text-leetcode-gray-900 dark:text-white bg-leetcode-gray-100 dark:bg-leetcode-gray-800 px-2 py-1 rounded">
                        {testcase.input}
                      </code>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-leetcode-gray-600 dark:text-leetcode-gray-400 mb-1">
                        Output:
                      </p>
                      <code className="text-sm text-leetcode-gray-900 dark:text-white bg-leetcode-gray-100 dark:bg-leetcode-gray-800 px-2 py-1 rounded">
                        {testcase.output}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Editor and Results */}
          <div className="space-y-6">
            {/* Language Selector */}
            <div className="bg-white dark:bg-leetcode-gray-800 rounded-xl border border-leetcode-gray-200 dark:border-leetcode-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-leetcode-gray-900 dark:text-white">
                  Solution
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-leetcode-gray-600 dark:text-leetcode-gray-400">
                    Language:
                  </span>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as 'JAVA' | 'PYTHON' | 'CPP')}
                    className="bg-leetcode-gray-100 dark:bg-leetcode-gray-700 text-leetcode-gray-900 dark:text-white px-3 py-1 rounded-md text-sm border border-leetcode-gray-300 dark:border-leetcode-gray-600 focus:outline-none focus:ring-2 focus:ring-leetcode-green"
                  >
                    <option value="JAVA">Java</option>
                    <option value="PYTHON">Python</option>
                    <option value="CPP">C++</option>
                  </select>
                </div>
              </div>
              
              <CodeEditor
                value={code}
                onChange={setCode}
                language={selectedLanguage}
              />
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-leetcode-gray-600 dark:text-leetcode-gray-400">
                  {isConnected ? (
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      Disconnected
                    </span>
                  )}
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !code.trim()}
                  className="flex items-center space-x-2 bg-leetcode-green hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>{submitting ? 'Running...' : 'Submit'}</span>
                </button>
              </div>
            </div>

            {/* Submission Results */}
            {(submitting || submissionResults) && (
              <div className="bg-white dark:bg-leetcode-gray-800 rounded-xl border border-leetcode-gray-200 dark:border-leetcode-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-leetcode-gray-900 dark:text-white">
                    Results
                  </h3>
                  {submissionResults?.status && (
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(submissionResults.status)}
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(submissionResults.status)}`}>
                        {submissionResults.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {submissionResults?.progress && (
                  <TestProgress
                    completed={submissionResults.progress.completed}
                    total={submissionResults.progress.total}
                  />
                )}

                {/* Percentage Score */}
                {submissionResults?.percentage !== undefined && (
                  <div className="mt-4 p-4 bg-leetcode-gray-50 dark:bg-leetcode-gray-900 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-leetcode-gray-600 dark:text-leetcode-gray-400">
                        Score:
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-2xl font-bold ${getPercentageColor(submissionResults.percentage)}`}>
                          {submissionResults.percentage}%
                        </span>
                        <span className="text-sm text-leetcode-gray-500 dark:text-leetcode-gray-400">
                          ({submissionResults.passedCount || 0}/{submissionResults.totalCount || 0} passed)
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress bar for percentage */}
                    <div className="mt-2 w-full bg-leetcode-gray-200 dark:bg-leetcode-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          submissionResults.percentage === 100 ? 'bg-green-500' :
                          submissionResults.percentage >= 60 ? 'bg-yellow-500' :
                          submissionResults.percentage > 0 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${submissionResults.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Individual Test Results */}
                {submissionResults?.results && submissionResults.results.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-md font-semibold text-leetcode-gray-900 dark:text-white">
                      Test Cases
                    </h4>
                    {submissionResults.results.map((result: any, index: number) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        result.passed 
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-leetcode-gray-700 dark:text-leetcode-gray-300">
                            Test Case {index + 1}
                          </span>
                          <div className="flex items-center space-x-2">
                            {result.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${
                              result.passed ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {result.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-leetcode-gray-600 dark:text-leetcode-gray-400">Input:</span>
                            <code className="block mt-1 p-2 bg-leetcode-gray-100 dark:bg-leetcode-gray-800 rounded text-leetcode-gray-900 dark:text-white">
                              {result.testcase?.input || 'N/A'}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-leetcode-gray-600 dark:text-leetcode-gray-400">Expected:</span>
                            <code className="block mt-1 p-2 bg-leetcode-gray-100 dark:bg-leetcode-gray-800 rounded text-leetcode-gray-900 dark:text-white">
                              {result.testcase?.output || 'N/A'}
                            </code>
                          </div>
                          <div>
                            <span className="font-medium text-leetcode-gray-600 dark:text-leetcode-gray-400">Your Output:</span>
                            <code className={`block mt-1 p-2 rounded ${
                              result.passed 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            }`}>
                              {result.output || result.error || 'No output'}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Error Message */}
                {submissionResults?.error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                      <strong>Error:</strong> {submissionResults.error}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail; 
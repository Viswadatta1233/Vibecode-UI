import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { problemAPI } from '../../services/api';
import { Search, Filter } from 'lucide-react';
import type { Problem } from '../../types';

const ProblemList: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, searchTerm, difficultyFilter]);

  const fetchProblems = async () => {
    try {
      const data = await problemAPI.getProblems();
      setProblems(data);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let filtered = problems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by difficulty
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty === difficultyFilter);
    }

    setFilteredProblems(filtered);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-leetcode-green"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-leetcode-gray-50 dark:bg-leetcode-gray-900 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 transition-colors duration-200">
      <div className="mb-6 sm:mb-8 w-full max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-leetcode-gray-900 dark:text-white mb-4 sm:mb-6 text-center">Problems</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 w-full">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-leetcode-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-leetcode-gray-300 dark:border-leetcode-gray-600 rounded-lg shadow-sm leading-5 bg-leetcode-gray-100 dark:bg-leetcode-gray-800 text-leetcode-gray-900 dark:text-white placeholder-leetcode-gray-500 dark:placeholder-leetcode-gray-400 focus:outline-none focus:ring-2 focus:ring-leetcode-green focus:border-leetcode-green text-sm sm:text-base transition-colors"
            />
          </div>
          
          <div className="relative sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-leetcode-gray-400" />
            </div>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="block w-full pl-10 pr-8 py-2 sm:py-3 border border-leetcode-gray-300 dark:border-leetcode-gray-600 rounded-lg shadow-sm leading-5 bg-leetcode-gray-100 dark:bg-leetcode-gray-800 text-leetcode-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-leetcode-green focus:border-leetcode-green text-sm sm:text-base transition-colors"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems List - Vertical Layout like LeetCode */}
      <div className="space-y-3 w-full max-w-6xl mx-auto">
        {filteredProblems.map((problem, index) => (
          <Link
            key={problem._id}
            to={`/problems/${problem._id}`}
            className="block bg-white dark:bg-leetcode-gray-800 rounded-xl border border-leetcode-gray-200 dark:border-leetcode-gray-700 hover:border-leetcode-green dark:hover:border-leetcode-green transition-all duration-200 overflow-hidden hover:shadow-lg w-full shadow-sm"
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <span className="text-leetcode-gray-500 dark:text-leetcode-gray-400 font-mono text-xs sm:text-sm">
                    {String(index + 1).padStart(3, '0')}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-leetcode-gray-900 dark:text-white hover:text-leetcode-green transition-colors line-clamp-1">
                    {problem.title}
                  </h3>
                </div>
                <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)} self-start sm:self-auto`}>
                  {problem.difficulty}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-leetcode-gray-600 dark:text-leetcode-gray-300 mb-3 sm:mb-4 line-clamp-2 ml-8 sm:ml-12 leading-relaxed">
                {problem.description}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-leetcode-gray-500 dark:text-leetcode-gray-400 ml-8 sm:ml-12 gap-1 sm:gap-0">
                <span className="capitalize">{problem.category || 'Algorithm'}</span>
                <span className="font-mono">#{problem._id.slice(-6)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProblems.length === 0 && !loading && (
        <div className="text-center py-12 max-w-6xl mx-auto">
          <div className="text-4xl sm:text-6xl mb-4">🔍</div>
          <p className="text-leetcode-gray-500 dark:text-leetcode-gray-400 text-base sm:text-lg mb-2">No problems found</p>
          <p className="text-leetcode-gray-400 dark:text-leetcode-gray-500 text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ProblemList; 
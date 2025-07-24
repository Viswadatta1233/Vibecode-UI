import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, Code } from 'lucide-react';
import type { LoginCredentials } from '../../types';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials);
      // Navigate to problems page after successful login
      navigate('/problems');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-leetcode-gray-50 dark:bg-leetcode-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Code className="h-10 w-10 sm:h-12 sm:w-12 text-leetcode-green" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-leetcode-gray-900 dark:text-white">
            Welcome back to <span className="text-leetcode-green">VibeCode</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-leetcode-gray-600 dark:text-leetcode-gray-300">
            Sign in to continue your coding journey
          </p>
        </div>
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-leetcode-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-leetcode-gray-300 dark:border-leetcode-gray-600 placeholder-leetcode-gray-500 dark:placeholder-leetcode-gray-400 text-leetcode-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-leetcode-green focus:border-leetcode-green text-sm sm:text-base bg-white dark:bg-leetcode-gray-800 transition-colors"
                placeholder="Email address"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-leetcode-gray-400" />
              </div>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-leetcode-gray-300 dark:border-leetcode-gray-600 placeholder-leetcode-gray-500 dark:placeholder-leetcode-gray-400 text-leetcode-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-leetcode-green focus:border-leetcode-green text-sm sm:text-base bg-white dark:bg-leetcode-gray-800 transition-colors"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-leetcode-gray-400 hover:text-leetcode-gray-600 dark:hover:text-leetcode-gray-200" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-leetcode-gray-400 hover:text-leetcode-gray-600 dark:hover:text-leetcode-gray-200" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-leetcode-red text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-leetcode-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-leetcode-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-leetcode-gray-600 dark:text-leetcode-gray-300">
              Don't have an account?{' '}
              <Link to="/signup" className="text-leetcode-green hover:text-green-600 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm; 
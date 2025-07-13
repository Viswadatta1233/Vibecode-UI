import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Code } from 'lucide-react';
import type { SignupCredentials } from '../../types';

const SignupForm: React.FC = () => {
  const [credentials, setCredentials] = useState<SignupCredentials>({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(credentials);
      // Navigate to problems page after successful signup
      navigate('/problems');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-leetcode-gray-50 dark:bg-leetcode-gray-900 py-12 px-0 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Code className="h-12 w-12 text-leetcode-green" />
          </div>
          <h2 className="text-3xl font-extrabold text-leetcode-gray-900 dark:text-white">
            Join <span className="text-leetcode-green">VibeCode</span>
          </h2>
          <p className="mt-2 text-leetcode-gray-600 dark:text-leetcode-gray-300">
            Start your coding journey today
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-leetcode-gray-400" />
              </div>
              <input
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-leetcode-gray-300 dark:border-leetcode-gray-600 placeholder-leetcode-gray-500 dark:placeholder-leetcode-gray-400 text-leetcode-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-leetcode-green focus:border-leetcode-green sm:text-sm bg-white dark:bg-leetcode-gray-800 transition-colors"
                placeholder="Full name"
                value={credentials.name}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-leetcode-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-leetcode-gray-300 dark:border-leetcode-gray-600 placeholder-leetcode-gray-500 dark:placeholder-leetcode-gray-400 text-leetcode-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-leetcode-green focus:border-leetcode-green sm:text-sm bg-white dark:bg-leetcode-gray-800 transition-colors"
                placeholder="Email address"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-leetcode-gray-400" />
              </div>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 pr-10 border border-leetcode-gray-300 dark:border-leetcode-gray-600 placeholder-leetcode-gray-500 dark:placeholder-leetcode-gray-400 text-leetcode-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-leetcode-green focus:border-leetcode-green sm:text-sm bg-white dark:bg-leetcode-gray-800 transition-colors"
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
                  <EyeOff className="h-5 w-5 text-leetcode-gray-400 hover:text-leetcode-gray-600 dark:hover:text-leetcode-gray-200" />
                ) : (
                  <Eye className="h-5 w-5 text-leetcode-gray-400 hover:text-leetcode-gray-600 dark:hover:text-leetcode-gray-200" />
                )}
              </button>
            </div>
          </div>

          <div>
            <select
              name="role"
              value={credentials.role}
              onChange={handleChange}
              className="block w-full py-3 px-3 border border-leetcode-gray-300 dark:border-leetcode-gray-600 bg-white dark:bg-leetcode-gray-800 text-leetcode-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-leetcode-green focus:border-leetcode-green sm:text-sm transition-colors"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-leetcode-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-leetcode-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-leetcode-gray-600 dark:text-leetcode-gray-300 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-leetcode-green hover:text-green-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm; 
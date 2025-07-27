import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Navbar from './components/layout/Navbar';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import ProblemList from './components/problems/ProblemList';
import ProblemDetail from './components/problems/ProblemDetail';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-leetcode-gray-900 transition-colors duration-200">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-leetcode-green"></div>
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Home Component
const Home: React.FC = () => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/problems" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-leetcode-gray-50 via-leetcode-gray-100 to-leetcode-gray-200 dark:from-leetcode-gray-900 dark:via-leetcode-gray-800 dark:to-leetcode-gray-900 transition-colors duration-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl text-center">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-leetcode-gray-900 dark:text-white mb-4 transition-colors duration-200">
            Welcome to <span className="text-leetcode-green">VibeCode</span>
          </h1>
          <p className="text-lg sm:text-xl text-leetcode-gray-600 dark:text-leetcode-gray-300 mb-6 sm:mb-8 px-4 transition-colors duration-200">
            A modern coding platform for practicing algorithms and data structures 
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 px-4">
          <div className="bg-white dark:bg-leetcode-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-leetcode-gray-200 dark:border-leetcode-gray-700 transition-colors duration-200">
            <h3 className="text-lg sm:text-xl font-semibold text-leetcode-gray-900 dark:text-white mb-2 transition-colors duration-200">Practice Coding</h3>
            <p className="text-sm sm:text-base text-leetcode-gray-600 dark:text-leetcode-gray-300 transition-colors duration-200">
              Solve problems across different difficulty levels
            </p>
          </div>

          <div className="bg-white dark:bg-leetcode-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-leetcode-gray-200 dark:border-leetcode-gray-700 transition-colors duration-200">
            <h3 className="text-lg sm:text-xl font-semibold text-leetcode-gray-900 dark:text-white mb-2 transition-colors duration-200">Real-time Execution</h3>
            <p className="text-sm sm:text-base text-leetcode-gray-600 dark:text-leetcode-gray-300 transition-colors duration-200">
              Run your code instantly with live feedback
            </p>
          </div>

          <div className="bg-white dark:bg-leetcode-gray-800 p-4 sm:p-6 rounded-lg shadow-md border border-leetcode-gray-200 dark:border-leetcode-gray-700 transition-colors duration-200">
            <h3 className="text-lg sm:text-xl font-semibold text-leetcode-gray-900 dark:text-white mb-2 transition-colors duration-200">Track Progress</h3>
            <p className="text-sm sm:text-base text-leetcode-gray-600 dark:text-leetcode-gray-300 transition-colors duration-200">
              Monitor your coding journey and improvement
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
          <a 
            href="/signup" 
            className="bg-leetcode-green hover:bg-green-600 text-white px-6 sm:px-8 py-3 rounded-md text-base sm:text-lg font-medium transition-all duration-200 hover:shadow-lg"
          >
            Get Started
          </a>
          <a 
            href="/login" 
            className="border border-leetcode-green text-leetcode-green hover:bg-leetcode-green hover:text-white px-6 sm:px-8 py-3 rounded-md text-base sm:text-lg font-medium transition-all duration-200 hover:shadow-lg"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Router>
      <div className="min-h-screen w-full bg-leetcode-gray-50 dark:bg-leetcode-gray-900 transition-colors duration-200">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-leetcode-gray-50 via-leetcode-gray-100 to-leetcode-gray-200 dark:from-leetcode-gray-900 dark:via-leetcode-gray-800 dark:to-leetcode-gray-900 transition-colors duration-200">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route
              path="/problems"
              element={
                <ProtectedRoute>
                  <ProblemList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/problems/:id"
              element={
                <ProtectedRoute>
                  <ProblemDetail />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="w-full text-center py-4 text-leetcode-gray-400 dark:text-leetcode-gray-500 text-sm border-t border-leetcode-gray-200 dark:border-leetcode-gray-700 bg-white dark:bg-leetcode-gray-800 mt-8 px-4 transition-colors duration-200">
          © {new Date().getFullYear()} VibeCode. All rights reserved.
        </footer>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#f9fafb' : '#1f2937',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
              maxWidth: '90vw',
              fontSize: '14px',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#00af9b',
                secondary: theme === 'dark' ? '#374151' : '#ffffff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ff2d55',
                secondary: theme === 'dark' ? '#374151' : '#ffffff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
};

// Root App Component with Auth Provider and Theme Provider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

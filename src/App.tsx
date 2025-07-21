import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
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
      <div className="flex justify-center items-center h-screen bg-white dark:bg-leetcode-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-leetcode-green"></div>
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Home Component
const Home: React.FC = () => {
  const { token } = useAuth();
  // const { theme } = useTheme(); // Remove unused

  if (token) {
    return <Navigate to="/problems" replace />;
  }

  return (
    <div className="min-h-screen w-full bg-main-app flex items-center justify-center px-0">
      <div className="w-full text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-leetcode-gray-900 dark:text-white mb-4">
            Welcome to <span className="text-leetcode-green">VibeCode</span>
          </h1>
          <p className="text-xl text-leetcode-gray-600 dark:text-leetcode-gray-300 mb-8">
            A modern coding platform for practicing algorithms and data structures 
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-leetcode-gray-800 p-6 rounded-lg shadow-md border border-leetcode-gray-200 dark:border-leetcode-gray-700">
            <div className="text-3xl mb-4">💻</div>
            <h3 className="text-lg font-semibold text-leetcode-gray-900 dark:text-white mb-2">Code Editor</h3>
            <p className="text-leetcode-gray-600 dark:text-leetcode-gray-300">Write, test, and submit your solutions with our integrated code editor</p>
          </div>
          <div className="bg-white dark:bg-leetcode-gray-800 p-6 rounded-lg shadow-md border border-leetcode-gray-200 dark:border-leetcode-gray-700">
            <div className="text-3xl mb-4">🧪</div>
            <h3 className="text-lg font-semibold text-leetcode-gray-900 dark:text-white mb-2">Test Cases</h3>
            <p className="text-leetcode-gray-600 dark:text-leetcode-gray-300">Run your code against multiple test cases to ensure correctness</p>
          </div>
          <div className="bg-white dark:bg-leetcode-gray-800 p-6 rounded-lg shadow-md border border-leetcode-gray-200 dark:border-leetcode-gray-700">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-leetcode-gray-900 dark:text-white mb-2">Real-time Results</h3>
            <p className="text-leetcode-gray-600 dark:text-leetcode-gray-300">Get instant feedback on your submissions with detailed results</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/signup"
            className="bg-leetcode-green hover:bg-green-600 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="border border-leetcode-green text-leetcode-green hover:bg-leetcode-green hover:text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  // const { theme } = useTheme(); // Remove unused
  
  return (
    <Router>
      <div className="min-h-screen w-full bg-leetcode-gray-50 dark:bg-leetcode-gray-900 transition-colors duration-200 bg-gradient-to-br from-leetcode-gray-50 via-leetcode-gray-100 to-leetcode-gray-200 dark:from-leetcode-gray-900 dark:via-leetcode-gray-800 dark:to-leetcode-gray-900">
        <Navbar />
        <main>
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
        <footer className="w-full text-center py-4 text-leetcode-gray-400 dark:text-leetcode-gray-500 text-sm border-t border-leetcode-gray-200 dark:border-leetcode-gray-700 bg-transparent mt-8">
          © {new Date().getFullYear()} VibeCode. All rights reserved.
        </footer>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#00af9b',
                secondary: '#ffffff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ff2d55',
                secondary: '#ffffff',
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

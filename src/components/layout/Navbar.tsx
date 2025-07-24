import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Code, LogOut, User, Sun, Moon, ChevronDown, Settings, BookOpen, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-leetcode-gray-800 shadow-sm border-b border-leetcode-gray-200 dark:border-leetcode-gray-700 transition-colors duration-200 w-full relative z-50">
      <div className="flex justify-between items-center h-16 w-full px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6 sm:h-8 sm:w-8 text-leetcode-green" />
            <span className="text-lg sm:text-xl font-bold text-leetcode-gray-900 dark:text-white">VibeCode</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {token ? (
            <>
              <Link
                to="/problems"
                className="text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Problems
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green transition-colors"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 p-2 rounded-md text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-leetcode-green rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium hidden lg:block">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-leetcode-gray-800 rounded-md shadow-lg border border-leetcode-gray-200 dark:border-leetcode-gray-700 py-1 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-leetcode-gray-200 dark:border-leetcode-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-leetcode-green rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-leetcode-gray-900 dark:text-white">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-leetcode-gray-500 dark:text-leetcode-gray-400">
                            {user?.email}
                          </p>
                          <p className="text-xs text-leetcode-gray-500 dark:text-leetcode-gray-400 capitalize">
                            {user?.role || 'user'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/problems"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-colors"
                      >
                        <BookOpen className="h-4 w-4 mr-3" />
                        My Problems
                      </Link>
                      
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-leetcode-gray-200 dark:border-leetcode-gray-700 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-leetcode-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green transition-colors"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <Link
                to="/login"
                className="text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-leetcode-green hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green transition-colors"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-leetcode-gray-800 border-t border-leetcode-gray-200 dark:border-leetcode-gray-700">
          <div className="px-4 py-2 space-y-1">
            {token ? (
              <>
                <Link
                  to="/problems"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  Problems
                </Link>
                
                {/* Mobile User Info */}
                <div className="px-3 py-3 border-t border-leetcode-gray-200 dark:border-leetcode-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-leetcode-green rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-leetcode-gray-900 dark:text-white">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-leetcode-gray-500 dark:text-leetcode-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/problems"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-colors"
                >
                  <BookOpen className="h-4 w-4 mr-3" />
                  My Problems
                </Link>
                
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full px-3 py-2 text-sm text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-leetcode-red hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 bg-leetcode-green hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsProfileOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar; 
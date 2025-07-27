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
    console.log('🔓 [NAVBAR] Logout clicked');
    try {
      logout();
      console.log('✅ [NAVBAR] Logout successful, navigating to login');
      navigate('/login');
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('❌ [NAVBAR] Logout error:', error);
    }
  };

  const handleMobileLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔓 [NAVBAR] Mobile logout clicked');
    try {
      logout();
      console.log('✅ [NAVBAR] Mobile logout successful, navigating to login');
      navigate('/login');
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('❌ [NAVBAR] Mobile logout error:', error);
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-leetcode-gray-800 shadow-sm border-b border-leetcode-gray-200 dark:border-leetcode-gray-700 transition-colors duration-200 w-full relative z-50 theme-transition">
      <div className="flex justify-between items-center h-16 w-full px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6 sm:h-8 sm:w-8 text-leetcode-green" />
            <span className="text-lg sm:text-xl font-bold text-leetcode-gray-900 dark:text-white transition-colors duration-200">VibeCode</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {token ? (
            <>
              <Link
                to="/problems"
                className="text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Problems
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-leetcode-gray-500 dark:text-leetcode-gray-400 hover:text-leetcode-gray-700 dark:hover:text-leetcode-gray-200 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  aria-label="User menu"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium hidden lg:block transition-colors duration-200">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-leetcode-gray-800 rounded-md shadow-lg py-1 z-50 border border-leetcode-gray-200 dark:border-leetcode-gray-700 transition-colors duration-200">
                    <div className="px-4 py-2 text-sm text-leetcode-gray-700 dark:text-leetcode-gray-300 border-b border-leetcode-gray-200 dark:border-leetcode-gray-700 transition-colors duration-200">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-leetcode-gray-500 dark:text-leetcode-gray-400 transition-colors duration-200">{user?.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/problems');
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-colors duration-200"
                    >
                      <BookOpen className="h-4 w-4 mr-3" />
                      Problems
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-colors duration-200"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Theme Toggle for Non-authenticated Users */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-leetcode-gray-500 dark:text-leetcode-gray-400 hover:text-leetcode-gray-700 dark:hover:text-leetcode-gray-200 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              
              <Link
                to="/login"
                className="text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-leetcode-green hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-leetcode-gray-500 dark:text-leetcode-gray-400 hover:text-leetcode-gray-700 dark:hover:text-leetcode-gray-200 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          
          {/* Hamburger Menu */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-leetcode-gray-500 dark:text-leetcode-gray-400 hover:text-leetcode-gray-700 dark:hover:text-leetcode-gray-200 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-all duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-leetcode-gray-800 border-t border-leetcode-gray-200 dark:border-leetcode-gray-700 transition-colors duration-200 mobile-menu relative z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {token ? (
              <>
                {/* User Info */}
                <div className="px-3 py-2 text-sm text-leetcode-gray-700 dark:text-leetcode-gray-300 border-b border-leetcode-gray-200 dark:border-leetcode-gray-700 mb-2 transition-colors duration-200">
                  <div className="font-medium mobile-text-fix">{user?.name}</div>
                  <div className="text-leetcode-gray-500 dark:text-leetcode-gray-400 mobile-text-fix">{user?.email}</div>
                </div>
                
                {/* Mobile Navigation Links */}
                <Link
                  to="/problems"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-all duration-200 mobile-text-fix"
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  Problems
                </Link>
                
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-all duration-200 mobile-text-fix"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </button>
                
                <button
                  onClick={handleMobileLogout}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleMobileLogout(e as any);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-all duration-200 cursor-pointer touch-manipulation mobile-logout-btn"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-leetcode-gray-700 dark:text-leetcode-gray-300 hover:text-leetcode-green hover:bg-leetcode-gray-100 dark:hover:bg-leetcode-gray-700 transition-all duration-200 mobile-text-fix"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-leetcode-green hover:bg-green-600 text-white transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
          }}
        />
      )}
      
      {/* Mobile menu backdrop - separate from profile dropdown */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={(e) => {
            // Only close if clicking the backdrop, not the menu itself
            if (e.target === e.currentTarget) {
              setIsMobileMenuOpen(false);
            }
          }}
        />
      )}
    </nav>
  );
};

export default Navbar; 
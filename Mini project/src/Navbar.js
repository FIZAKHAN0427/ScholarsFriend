// src/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${darkMode ? 'bg-gray-900/95 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <img 
              src={darkMode ? '/images/image22.png' : '/images/image.png'} 
              alt="Logo"
              className="h-10 w-auto transition-transform duration-300 hover:scale-105" 
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium hover:text-blue-500 transition-all duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              Home
            </Link>

            <Link 
              to="/research-steps" 
              className={`text-sm font-medium hover:text-blue-500 transition-all duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              Research Steps
            </Link>
            
            <Link 
              to="/check-article"
              className={`text-sm font-medium hover:text-blue-500 transition-all duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              Article Checker
            </Link>

            <Link 
              to="/ai-tools"
              className={`text-sm font-medium hover:text-blue-500 transition-all duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              AI Tools
            </Link>

            <Link 
              to="/journal-compare"
              className={`text-sm font-medium hover:text-blue-500 transition-all duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              Journal Compare
            </Link>

            <Link 
              to="/academic-search"
              className={`text-sm font-medium hover:text-blue-500 transition-all duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
            >
              Academic Search
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-900'}`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/research-steps" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Research Steps
            </Link>
            <Link 
              to="/check-article"
              className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Article Checker
            </Link>
            <Link 
              to="/ai-tools"
              className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              AI Tools
            </Link>
            <Link 
              to="/journal-compare"
              className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Journal Compare
            </Link>
            <Link 
              to="/academic-search"
              className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-800 hover:bg-gray-100'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Academic Search
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

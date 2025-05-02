// src/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ darkMode, setDarkMode }) => {
  return (
    <nav className={`flex justify-between items-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
      {/* Logo Section */}
      <div className="flex items-center">
        <img 
          src={darkMode ? '/images/image22.png' : '/images/image.png'} 
          alt="Logo"
          className="h-12 w-auto" 
        />
      </div>
      
      <div className="flex items-center space-x-6">
        <Link 
          to="/" 
          className={`hover:text-blue-500 transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
        >
          Home
        </Link>

        <Link 
          to="/research-steps" 
          className={`hover:text-blue-500 transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
        >
          Research Steps
        </Link>
        
        <Link 
          to="/check-article"
          className={`hover:text-blue-500 transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
        >
          Article Checker
        </Link>

        <Link 
          to="/ai-tools"
          className={`hover:text-blue-500 transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
        >
          AI Tools
        </Link>

        <Link 
          to="/journal-compare"
          className={`hover:text-blue-500 transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
        >
          Journal Compare
        </Link>

        <Link 
          to="/academic-search"
          className={`hover:text-blue-500 transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}
        >
          Academic Search
        </Link>

        {/* Toggle for dark/light mode */}
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="hidden"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <div className={`block w-14 h-8 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 w-6 h-6 rounded-full shadow transition-transform duration-300 ${darkMode ? 'transform translate-x-6 bg-white' : 'bg-white'}`}></div>
          </div>
        </label>
      </div>
    </nav>
  );
};

export default Navbar;

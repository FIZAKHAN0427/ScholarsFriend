import React from 'react';
import { Link } from 'react-router-dom';
import AboutUs from './AboutUs';
import OurServices from './OurServices';
import AssessorsAndPublishers from './AssessorsAndPublishers';

const Home = ({ darkMode }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className={`bg-cover bg-center h-[60vh] flex items-center justify-center relative ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Your Trusted Partner<br />for Genuine Research Platforms and Publishers
          </h1>
          <Link 
            to="/academic-search"
            className={`inline-block px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Start Your Search
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Research Steps</h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Follow our comprehensive guide to navigate through the research process effectively.
            </p>
            <Link 
              to="/research-steps"
              className={`inline-block px-4 py-2 rounded-md transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-black'
              }`}
            >
              Learn More
            </Link>
          </div>

          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Article Checker</h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Verify the authenticity and quality of research articles with our advanced checking tools.
            </p>
            <Link 
              to="/check-article"
              className={`inline-block px-4 py-2 rounded-md transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-black'
              }`}
            >
              Check Articles
            </Link>
          </div>

          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Journal Metrics</h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Compare and analyze journal metrics to make informed publishing decisions.
            </p>
            <Link 
              to="/journal-compare"
              className={`inline-block px-4 py-2 rounded-md transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-black'
              }`}
            >
              Compare Journals
            </Link>
          </div>
        </div>
      </div>

      <AboutUs darkMode={darkMode} />
      <OurServices />
      <AssessorsAndPublishers darkMode={darkMode} />
    </div>
  );
};

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import AboutUs from './AboutUs';
import OurServices from './OurServices';
import AssessorsAndPublishers from './AssessorsAndPublishers';

const Home = ({ darkMode }) => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <div className={`relative min-h-[80vh] flex items-center justify-center overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Trusted Partner for
            <span className="block text-blue-600 mt-2">Genuine Research Platforms</span>
          </h1>
          <p className={`text-lg md:text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Navigate the academic landscape with confidence using our comprehensive suite of research tools and resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/academic-search"
              className={`inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
              }`}
            >
              Start Your Search
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              to="/research-steps"
              className={`inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-white hover:bg-gray-50 text-gray-900 shadow-lg'
              }`}
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className={`group p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
            darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="w-12 h-12 mb-6 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Research Steps</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Follow our comprehensive guide to navigate through the research process effectively and efficiently.
            </p>
            <Link 
              to="/research-steps"
              className={`inline-flex items-center text-sm font-medium transition-colors duration-200 ${
                darkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              Learn More
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className={`group p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
            darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="w-12 h-12 mb-6 rounded-xl bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Article Checker</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Verify the authenticity and quality of research articles with our advanced checking tools and metrics.
            </p>
            <Link 
              to="/check-article"
              className={`inline-flex items-center text-sm font-medium transition-colors duration-200 ${
                darkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              Check Articles
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className={`group p-8 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
            darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
          }`}>
            <div className="w-12 h-12 mb-6 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Journal Metrics</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Compare and analyze journal metrics to make informed publishing decisions with confidence.
            </p>
            <Link 
              to="/journal-compare"
              className={`inline-flex items-center text-sm font-medium transition-colors duration-200 ${
                darkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              Compare Journals
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <AboutUs darkMode={darkMode} />
      <OurServices darkMode={darkMode} />
      <AssessorsAndPublishers darkMode={darkMode} />
    </div>
  );
};

export default Home;
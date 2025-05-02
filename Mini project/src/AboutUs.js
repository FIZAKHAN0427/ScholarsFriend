// src/AboutUs.js
import React from 'react';

const AboutUs = ({ darkMode }) => {
  return (
    <section className={`relative py-20 overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <div className="relative group">
              <div className={`absolute -inset-4 rounded-2xl transition duration-300 group-hover:scale-105 ${
                darkMode ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
              }`}></div>
              <img 
                src="/images/xoxo.jpg" 
                alt="About Us"
                className="relative rounded-2xl shadow-2xl transform transition duration-300 group-hover:scale-105"
              />
              <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full ${
                darkMode ? 'bg-blue-600/20' : 'bg-blue-400/20'
              } blur-2xl`}></div>
            </div>

            {/* Content Section */}
            <div className={`space-y-8 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              <div className="space-y-4">
                <h2 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  About <span className="text-blue-600">Scholars Friend</span>
                </h2>
                <div className={`w-20 h-1 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
              </div>

              <p className="text-lg leading-relaxed">
                Scholars Friend is a freely accessible platform designed for scholars, researchers, publishers, colleges, and universities. Our platform offers a streamlined search with filters for international journals, publishers, and research papers.
              </p>

              <p className="text-lg leading-relaxed">
                We developed this portal to provide researchers with a comprehensive source of genuine information about various journals, complete with relevant indexing details.
              </p>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Journals</div>
                </div>
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Publishers</div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4 pt-8">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Comprehensive Journal Database
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Advanced Search Filters
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Real-time Indexing Information
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

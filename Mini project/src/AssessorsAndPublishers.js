// src/AssessorsAndPublishers.js
import React from 'react';

const AssessorsAndPublishers = ({ darkMode }) => {
  return (
    <section className={`relative py-20 overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Understanding <span className="text-blue-600">Assessors</span> and <span className="text-blue-600">Publishers</span>
          </h2>
          <div className={`w-20 h-1 rounded-full mx-auto mb-8 ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
          <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover the key players in academic publishing and how they ensure research quality and dissemination
          </p>
        </div>

        {/* Assessors Section */}
        <div className={`group mb-16 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:-translate-y-1 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Assessors: Ensuring Research Quality
                  </h3>
                </div>
                
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Assessors evaluate the credibility and quality of journals. They help researchers find trustworthy places to publish.
                </p>

                <ul className="space-y-4">
                  {[
                    { title: 'Scopus', description: 'High-quality peer-reviewed journals' },
                    { title: 'Web of Science', description: 'Rigorous journal assessment' },
                    { title: 'UGC CARE', description: 'Ensures academic standards for Indian scholars' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</span>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="relative group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/images/IMG3.jpg" 
                alt="Assessors"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${
                darkMode ? 'from-gray-900/50 to-transparent' : 'from-white/50 to-transparent'
              }`}></div>
            </div>
          </div>
        </div>

        {/* Publishers Section */}
        <div className={`group rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:-translate-y-1 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative group-hover:scale-105 transition-transform duration-300 lg:order-2">
              <img 
                src="/images/IMG4.jpg" 
                alt="Publishers"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-l ${
                darkMode ? 'from-gray-900/50 to-transparent' : 'from-white/50 to-transparent'
              }`}></div>
            </div>

            <div className="p-8 lg:p-12 lg:order-1">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Publishers: Shaping Research Output
                  </h3>
                </div>
                
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Publishers play a crucial role in disseminating research. They ensure the research reaches a global audience.
                </p>

                <ul className="space-y-4">
                  {[
                    { title: 'Quality Publishing', description: 'Ensures high visibility and credibility' },
                    { title: 'Open Access', description: 'Provides free access to research for everyone' },
                    { title: 'Impact Factor', description: 'A measure of journal quality based on citations' }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</span>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessorsAndPublishers;

// src/OurServices.js
import React from 'react';

const OurServices = ({ darkMode }) => {
  const services = [
    {
      image: 'images/image3.png',
      title: 'Verifies Indexing',
      description: 'Verify journal indexing status across multiple databases',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      image: 'images/image4.png',
      title: 'Scholar AI',
      description: 'AI-powered research assistance and analysis',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      image: 'images/image5.png',
      title: 'Citation Checker',
      description: 'Validate and format citations automatically',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
    },
    {
      image: 'images/image7.png',
      title: 'Fake Site Identification',
      description: 'Detect and avoid predatory journals',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      image: 'images/image8.png',
      title: 'Keyword-Based Searching',
      description: 'Advanced search with multiple filters',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      image: 'images/image6.png',
      title: 'AI Suggester',
      description: 'Get AI-powered journal recommendations',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Our <span className="text-blue-600">Services</span>
          </h2>
          <div className={`w-20 h-1 rounded-full mx-auto mb-8 ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover our comprehensive suite of tools designed to enhance your research experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-750' 
                  : 'bg-white hover:bg-gray-50'
              } shadow-lg hover:shadow-xl`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                darkMode 
                  ? 'bg-gradient-to-br from-blue-600/10 to-purple-600/10' 
                  : 'bg-gradient-to-br from-blue-50 to-purple-50'
              }`}></div>

              {/* Content */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${
                  darkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                }`}>
                  {service.icon}
                </div>
                
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-16 h-16 mb-6 object-contain"
                />
                
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {service.title}
                </h3>
                
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {service.description}
                </p>

                {/* Hover Effect Line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 rounded-full transition-all duration-300 group-hover:w-full ${
                  darkMode ? 'bg-blue-500' : 'bg-blue-600'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;

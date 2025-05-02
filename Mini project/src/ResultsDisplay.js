import React, { useState } from 'react';

const ResultsDisplay = ({ darkMode, results, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const journalsPerPage = 6;
  
  // Calculate pagination
  const indexOfLastJournal = currentPage * journalsPerPage;
  const indexOfFirstJournal = indexOfLastJournal - journalsPerPage;
  const currentJournals = results.slice(indexOfFirstJournal, indexOfLastJournal);
  const totalPages = Math.ceil(results.length / journalsPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <>
      {loading && (
        <div className="flex justify-center mt-4">
          <p className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Loading...</p>
        </div>
      )}

      {error && (
        <div className="text-center mt-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="mt-6">
          <h2 className={`text-2xl font-bold text-center mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Journal Results ({results.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJournals.map((result, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg shadow-lg transition-all duration-200 ${
                  darkMode 
                    ? 'bg-[#23272F] border border-[#2D333B] text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                {/* Journal Title */}
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-teal-400' : 'text-blue-600'}`}>
                  {result.journal_title || result.title || 'Journal'}
                </h3>
                
                <div className="space-y-2">
                  {result.issn && (
                    <p className="flex items-center">
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>ISSN:</span>
                      <span className="ml-2">{result.issn}</span>
                    </p>
                  )}
                  
                  {result.eissn && (
                    <p className="flex items-center">
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>eISSN:</span>
                      <span className="ml-2">{result.eissn}</span>
                    </p>
                  )}
                  
                  {result.publisher && (
                    <p className="flex items-center">
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Publisher:</span>
                      <span className="ml-2">{result.publisher}</span>
                    </p>
                  )}
                  
                  <p className="flex items-center">
                    <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status:</span>
                    <span className={`ml-2 ${result.status.includes('Discontinued') ? 'text-red-500' : 'text-green-500'}`}>
                      {result.status}
                    </span>
                  </p>
                  
                  {result.subject_areas && result.subject_areas.length > 0 && (
                    <p className="flex items-center">
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subjects:</span>
                      <span className="ml-2">{result.subject_areas.join(', ')}</span>
                    </p>
                  )}
                  
                  {result.cite_score && result.cite_score !== 'N/A' && (
                    <p className="flex items-center">
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>CiteScore:</span>
                      <span className="ml-2">{result.cite_score}</span>
                    </p>
                  )}
                  
                  {result.quartile && result.quartile !== 'N/A' && (
                    <p className="flex items-center">
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quartile:</span>
                      <span className={`ml-2 ${
                        result.quartile === 'Q1' ? "text-green-500" : 
                        result.quartile === 'Q2' ? "text-blue-500" : 
                        result.quartile === 'Q3' ? "text-yellow-500" : 
                        "text-red-500"
                      }`}>
                        {result.quartile}
                      </span>
                    </p>
                  )}
                  
                  {result.open_access !== undefined && (
                    <p className="flex items-center">
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Open Access:</span>
                      <span className={`ml-2 ${result.open_access === '1' ? "text-green-500" : "text-red-500"}`}>
                        {result.open_access === '1' ? "Yes" : "No"}
                      </span>
                    </p>
                  )}
                </div>
                
                {result.journal_url && (
                  <div className="mt-4">
                    <a
                      href={result.journal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 ${
                        darkMode
                          ? 'bg-teal-600 hover:bg-teal-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      View Journal
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : darkMode
                      ? 'bg-teal-600 hover:bg-teal-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 ${
                    currentPage === number
                      ? darkMode
                        ? 'bg-teal-700 text-white'
                        : 'bg-blue-700 text-white'
                      : darkMode
                        ? 'bg-teal-600 hover:bg-teal-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {number}
                </button>
              ))}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : darkMode
                      ? 'bg-teal-600 hover:bg-teal-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      
      {results.length === 0 && !loading && !error && (
        <div className="mt-6 text-center">
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No results found. Try adjusting your search or filters.
          </p>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
import React from 'react';

const ResultsDisplay = ({ darkMode, results, loading }) => {
  return (
    <>
      {loading && (
        <div className="flex justify-center mt-4">
          <p className="text-lg font-semibold text-gray-500">Loading...</p>
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-center mb-4">Top 5 Journals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border border-gray-300 journal-box`}
              >
                <h3 className="text-xl font-bold mb-2">{result.journal_title}</h3>
                <p><strong>ISSN:</strong> {result.issn}</p>
                <p><strong>Publisher:</strong> {result.publisher}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`${result.status.includes("Indexed") ? "text-green-500" : "text-red-500"}`}>
                    {result.status}
                  </span>
                </p>
                {result.coverage_years && (
                  <p><strong>Years Covered:</strong> {result.coverage_years}</p>
                )}
                {result.discontinued_date && (
                  <p><strong>Discontinued Date:</strong> {result.discontinued_date}</p>
                )}
                {result.redirect_links && result.redirect_links.length > 0 && (
                  <a
                    href={result.redirect_links[0]?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Visit Journal
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay;
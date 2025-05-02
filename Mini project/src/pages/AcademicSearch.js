import React, { useState, useEffect } from 'react';
import SearchBar from '../SearchBar';
import Filters from '../Filters';
import ResultsDisplay from '../ResultsDisplay';

const AcademicSearch = ({ darkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    subjectArea: '',
    indexing: '',
    citeScoreMin: '',
    citeScoreMax: '',
    openAccess: '',
    publisher: '',
    quartile: ''
  });
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const count = Object.values(filters).filter((value) => value !== '').length;
    setActiveFilters(count);
  }, [filters]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const apiUrl = new URL(`http://127.0.0.1:5000/api/journal`);
      apiUrl.searchParams.append('title', encodeURIComponent(searchQuery));
      
      // Add filters to URL
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          apiUrl.searchParams.append(key, value);
        }
      });

      console.log('Searching with URL:', apiUrl.toString());

      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch data');
        setResults([]);
        return;
      }
      const data = await response.json();
      setResults(Array.isArray(data) ? data : [data]);
      setError('');
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('An error occurred while fetching data');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/journal/suggestions?title=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setFilters({
      subjectArea: '',
      indexing: '',
      citeScoreMin: '',
      citeScoreMax: '',
      openAccess: '',
      publisher: '',
      quartile: ''
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#181A20]' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl md:text-4xl font-extrabold text-center mb-8 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
            style={{ letterSpacing: '0.01em' }}>
            <span className={darkMode ? 'text-teal-400' : 'text-blue-700'}>Academic Journal Search</span>
          </h1>
          <div className={`rounded-2xl shadow-2xl p-8 mb-10 transition-colors duration-300 ${darkMode ? 'bg-[#23272F] border border-[#23272F]' : 'bg-white border border-gray-200'}`}>
            <SearchBar
              darkMode={darkMode}
              searchQuery={searchQuery}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              handleSearch={handleSearch}
              suggestions={suggestions}
              setSearchQuery={setSearchQuery}
              setSuggestions={setSuggestions}
            />
            <div className="flex justify-center mt-6">
              <button 
                onClick={toggleFilters}
                className={`px-6 py-2 rounded-lg font-semibold shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
                  darkMode 
                    ? 'bg-teal-600 hover:bg-teal-500 text-white' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'} {activeFilters > 0 && `(${activeFilters})`}
              </button>
            </div>
            {showFilters && (
              <div className="mt-6">
                <Filters
                  darkMode={darkMode}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                  handleSearch={handleSearch}
                  resetFilters={resetFilters}
                />
              </div>
            )}
          </div>
          <ResultsDisplay
            darkMode={darkMode}
            results={results}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicSearch; 
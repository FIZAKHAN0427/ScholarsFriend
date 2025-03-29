import React, { useState } from 'react';
import SearchBar from './SearchBar';
import Filters from './Filters';
import ResultsDisplay from './ResultsDisplay';
import AboutUs from './AboutUs';
import OurServices from './OurServices';
import AssessorsAndPublishers from './AssessorsAndPublishers';

const Home = ({ darkMode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    country: '',
    subjectArea: '',
    indexing: '',
    publicationYear: '',
    citeScoreMin: '',
    citeScoreMax: '',
    openAccess: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const apiUrl = new URL(`http://127.0.0.1:5000/api/journal?title=${encodeURIComponent(searchQuery)}`);
      Object.keys(filters).forEach(key => filters[key] && apiUrl.searchParams.append(key, filters[key]));

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
        const response = await fetch(`http://127.0.0.1:5000/api/journal/suggestions?title=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        } else {
          console.error("Failed to fetch suggestions:", response.statusText);
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
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="bg-cover bg-center h-60 flex items-center justify-center">
        <h1 className={`text-5xl font-bold text-center p-6`}>
          Your Trusted Partner<br />for Genuine Research Platforms and Publishers
        </h1>
      </div>

      <div className="flex justify-center items-center mt-10">
        <div className="container mx-auto p-10 relative">
          <h2 className="text-2xl font-bold text-center mb-4">SEARCH FOR A JOURNAL</h2>
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
          {/* <Filters
            darkMode={darkMode}
            filters={filters}
            handleFilterChange={handleFilterChange}
            handleSearch={handleSearch}
          /> */}
          <ResultsDisplay
            darkMode={darkMode}
            results={results}
            loading={loading}
          />
        </div>
      </div>

      <AboutUs darkMode={darkMode} />
      <OurServices />
      <AssessorsAndPublishers darkMode={darkMode} />
    </>
  );
};

export default Home;

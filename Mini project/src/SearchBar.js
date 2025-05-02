import React from 'react';

const SearchBar = ({
  darkMode,
  searchQuery,
  handleInputChange,
  handleKeyDown,
  handleSearch,
  suggestions,
  setSearchQuery,
  setSuggestions,
}) => {
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.journal_title);
    setSuggestions([]);
  };

  const handleSearchClick = () => {
    setSuggestions([]);
    handleSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSuggestions([]);
      handleSearch();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Search for journals..."
          className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
            darkMode
              ? 'bg-[#23272F] border-[#2D333B] text-white placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
        <button
          onClick={handleSearchClick}
          className={`ml-2 px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
            darkMode
              ? 'bg-teal-600 hover:bg-teal-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          Search
        </button>
      </div>
      {suggestions.length > 0 && (
        <div
          className={`absolute z-10 w-full mt-1 rounded-lg shadow-lg overflow-hidden ${
            darkMode ? 'bg-[#23272F] border border-[#2D333B]' : 'bg-white border border-gray-200'
          }`}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-2 cursor-pointer hover:bg-opacity-10 ${
                darkMode
                  ? 'hover:bg-white text-white'
                  : 'hover:bg-gray-100 text-gray-900'
              }`}
            >
              {suggestion.journal_title} {suggestion.issn && `(${suggestion.issn})`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
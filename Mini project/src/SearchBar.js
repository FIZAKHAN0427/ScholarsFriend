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
  return (
    <div className="flex items-center justify-center mt-4 relative">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter Journal Name"
        className={`border rounded-md p-3 w-1/2 mr-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'} border-gray-300`}
      />
      <button
        onClick={handleSearch}
        className={`rounded-md px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-400'} text-white border border-blue-400`}
      >
        Search
      </button>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className={`absolute z-10 top-12 w-1/2 rounded-md shadow-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
          {suggestions.slice(0, 6).map((suggestion, index) => (
            <div
              key={index}
              className={`p-2 hover:${darkMode ? 'bg-gray-600' : 'bg-gray-200'} cursor-pointer`}
              onClick={() => {
                setSearchQuery(suggestion.journal_title);
                setSuggestions([]);
              }}
            >
              {suggestion.journal_title} ({suggestion.issn})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
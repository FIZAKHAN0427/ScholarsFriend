import React from 'react';

const Filters = ({ darkMode, filters, handleFilterChange, handleSearch, resetFilters }) => {
  const handleApplyFilters = () => {
    handleSearch();
  };

  return (
    <div className={`mt-6 p-6 rounded-lg ${darkMode ? 'bg-[#1E222A]' : 'bg-gray-50'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Subject Area */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Subject Area
          </label>
          <select
            name="subjectArea"
            value={filters.subjectArea}
            onChange={handleFilterChange}
            className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
              darkMode
                ? 'bg-[#23272F] border-[#2D333B] text-white focus:ring-teal-500 focus:border-teal-500'
                : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            <option value="">All Subjects</option>
            <option value="AGRI">Agricultural and Biological Sciences</option>
            <option value="ARTS">Arts and Humanities</option>
            <option value="BIOC">Biochemistry, Genetics and Molecular Biology</option>
            <option value="BUSI">Business, Management and Accounting</option>
            <option value="CENG">Chemical Engineering</option>
            <option value="CHEM">Chemistry</option>
            <option value="COMP">Computer Science</option>
            <option value="DECI">Decision Sciences</option>
            <option value="DENT">Dentistry</option>
            <option value="EART">Earth and Planetary Sciences</option>
            <option value="ECON">Economics, Econometrics and Finance</option>
            <option value="ENER">Energy</option>
            <option value="ENGI">Engineering</option>
            <option value="ENVI">Environmental Science</option>
            <option value="HEAL">Health Professions</option>
            <option value="IMMU">Immunology and Microbiology</option>
            <option value="MATE">Materials Science</option>
            <option value="MATH">Mathematics</option>
            <option value="MEDI">Medicine</option>
            <option value="NEUR">Neuroscience</option>
            <option value="NURS">Nursing</option>
            <option value="PHAR">Pharmacology, Toxicology and Pharmaceutics</option>
            <option value="PHYS">Physics and Astronomy</option>
            <option value="PSYC">Psychology</option>
            <option value="SOCI">Social Sciences</option>
            <option value="VETE">Veterinary</option>
          </select>
        </div>

        {/* Indexing */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Indexing
          </label>
          <select
            name="indexing"
            value={filters.indexing}
            onChange={handleFilterChange}
            className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
              darkMode
                ? 'bg-[#23272F] border-[#2D333B] text-white focus:ring-teal-500 focus:border-teal-500'
                : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            <option value="">All Indexing</option>
            <option value="SCI">Science Citation Index</option>
            <option value="SSCI">Social Sciences Citation Index</option>
            <option value="AHCI">Arts & Humanities Citation Index</option>
            <option value="ESCI">Emerging Sources Citation Index</option>
          </select>
        </div>

        {/* CiteScore Range */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            CiteScore Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="citeScoreMin"
              value={filters.citeScoreMin}
              onChange={handleFilterChange}
              placeholder="Min"
              className={`w-1/2 px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
                darkMode
                  ? 'bg-[#23272F] border-[#2D333B] text-white focus:ring-teal-500 focus:border-teal-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            <input
              type="number"
              name="citeScoreMax"
              value={filters.citeScoreMax}
              onChange={handleFilterChange}
              placeholder="Max"
              className={`w-1/2 px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
                darkMode
                  ? 'bg-[#23272F] border-[#2D333B] text-white focus:ring-teal-500 focus:border-teal-500'
                  : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
          </div>
        </div>

        {/* Open Access */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Open Access
          </label>
          <select
            name="openAccess"
            value={filters.openAccess}
            onChange={handleFilterChange}
            className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
              darkMode
                ? 'bg-[#23272F] border-[#2D333B] text-white focus:ring-teal-500 focus:border-teal-500'
                : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            <option value="">All Access Types</option>
            <option value="1">Open Access</option>
            <option value="0">Subscription</option>
          </select>
        </div>

        {/* Publisher */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Publisher
          </label>
          <select
            name="publisher"
            value={filters.publisher}
            onChange={handleFilterChange}
            className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
              darkMode
                ? 'bg-[#23272F] border-[#2D333B] text-white focus:ring-teal-500 focus:border-teal-500'
                : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            <option value="">All Publishers</option>
            <option value="Elsevier">Elsevier</option>
            <option value="Springer">Springer</option>
            <option value="Wiley">Wiley</option>
            <option value="IEEE">IEEE</option>
            <option value="Taylor & Francis">Taylor & Francis</option>
            <option value="SAGE">SAGE</option>
            <option value="Oxford University Press">Oxford University Press</option>
            <option value="Cambridge University Press">Cambridge University Press</option>
          </select>
        </div>

        {/* Quartile */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Quartile
          </label>
          <select
            name="quartile"
            value={filters.quartile}
            onChange={handleFilterChange}
            className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-200 ${
              darkMode
                ? 'bg-[#23272F] border-[#2D333B] text-white focus:ring-teal-500 focus:border-teal-500'
                : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            <option value="">All Quartiles</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={resetFilters}
          className={`px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Reset Filters
        </button>
        <button
          onClick={handleApplyFilters}
          className={`px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
            darkMode
              ? 'bg-teal-600 hover:bg-teal-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
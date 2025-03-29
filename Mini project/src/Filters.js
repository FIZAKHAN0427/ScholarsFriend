import React from 'react';

const Filters = ({ darkMode, filters, handleFilterChange, handleSearch }) => {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-4">
      <select
        name="country"
        onChange={handleFilterChange}
        className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
      >
        <option value="">Paid/Free</option>
        <option value="Paid">Paid</option>
        <option value="Free">Free</option>
      </select>
      <select
        name="subjectArea"
        onChange={handleFilterChange}
        className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
      >
        <option value="">Subject Area</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Engineering">Engineering</option>
        <option value="Medicine">Medicine</option>
        <option value="Electronics">Electronics</option>
      </select>
      <select
        name="indexing"
        onChange={handleFilterChange}
        className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
      >
        <option value="">Indexing</option>
        <option value="Scopus">Scopus</option>
        <option value="UGC">UGC Care</option>
        <option value="WoS">Web of Science</option>
      </select>
      <select
        name="publicationYear"
        onChange={handleFilterChange}
        className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
      >
        <option value="">Publication Year</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
      </select>
      <input
        type="number"
        name="citeScoreMin"
        placeholder="Min CiteScore"
        onChange={handleFilterChange}
        className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
      />
      <input
        type="number"
        name="citeScoreMax"
        placeholder="Max CiteScore"
        onChange={handleFilterChange}
        className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
      />
      <select
        name="openAccess"
        onChange={handleFilterChange}
        className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
      >
        <option value="">Open Access</option>
        <option value="1">Yes</option>
        <option value="0">No</option>
      </select>
      <button
        onClick={handleSearch}
        className="px-4 py-2 rounded-md bg-green-500 text-white"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;
// src/FilterSidebar.js
import React, { useState } from 'react';

const FilterSidebar = ({ onApplyFilters }) => {
  const [country, setCountry] = useState('');
  const [subjectArea, setSubjectArea] = useState('');
  const [publicationYear, setPublicationYear] = useState('');

  const handleApplyFilters = () => {
    onApplyFilters({ country, subjectArea, publicationYear });
  };

  return (
    <div className="p-4 border-r">
      <h3 className="text-lg font-bold mb-4">Filters</h3>
      <div className="mb-4">
        <label>Country</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter country"
        />
      </div>
      <div className="mb-4">
        <label>Subject Area</label>
        <input
          type="text"
          value={subjectArea}
          onChange={(e) => setSubjectArea(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter subject area"
        />
      </div>
      <div className="mb-4">
        <label>Publication Year</label>
        <input
          type="number"
          value={publicationYear}
          onChange={(e) => setPublicationYear(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter publication year"
        />
      </div>
      <button onClick={handleApplyFilters} className="bg-blue-500 text-white p-2 rounded">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;

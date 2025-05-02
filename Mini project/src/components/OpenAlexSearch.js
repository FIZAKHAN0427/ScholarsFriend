// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import _ from 'lodash';

// const OpenAlexSearch = ({ darkMode }) => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [totalResults, setTotalResults] = useState(0);
//     const [page, setPage] = useState(1);
//     const [filters, setFilters] = useState({
//         oa: false,
//         from_publication_date: '',
//         to_publication_date: '',
//         type: 'all',
//         sort: 'relevance'
//     });
//     const [error, setError] = useState(null);
//     const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

//     // Use a valid email for the OpenAlex API
//     const email = "scholarsfriend@gmail.com";

//     const makeUrl = (pathName, searchParams) => {
//         const params = new URLSearchParams();
        
//         // Add email parameter - this is required by OpenAlex
//         params.set("mailto", email);
        
//         // Add per_page parameter if not already set
//         if (!searchParams.per_page) {
//             params.set("per_page", 10);
//         }
        
//         // Add all non-empty parameters
//         Object.entries(searchParams).forEach(([key, value]) => {
//             if (value !== '' && value !== 'all' && value !== false) {
//                 // Handle boolean values
//                 if (typeof value === 'boolean') {
//                     params.set(key, value ? 'true' : 'false');
//                 } else {
//                     params.set(key, value);
//                 }
//             }
//         });

//         // Ensure path starts with /
//         if (!pathName.startsWith('/')) {
//             pathName = '/' + pathName;
//         }
        
//         const baseAndPath = "https://api.openalex.org" + pathName;
//         const paramsStr = params.toString();
        
//         return paramsStr ? `${baseAndPath}?${paramsStr}` : baseAndPath;
//     };

//     const searchWorks = async () => {
//         if (!searchQuery) return;

//         setLoading(true);
//         setError(null);
//         try {
//             const searchParams = {
//                 search: searchQuery,
//                 page: page,
//                 per_page: 10,
//                 ...filters
//             };

//             // Format boolean values correctly
//             if (searchParams.oa) {
//                 searchParams.oa = true;
//             }

//             const url = makeUrl("/works", searchParams);
//             console.log("Searching with URL:", url);
            
//             // Use a proxy server to avoid CORS issues
//             const proxyUrl = "https://cors-anywhere.herokuapp.com/";
//             const response = await axios.get(proxyUrl + url, {
//                 headers: {
//                     'Origin': window.location.origin,
//                     'X-Requested-With': 'XMLHttpRequest'
//                 }
//             });
            
//             console.log("Search response:", response.data);
            
//             if (response.data && response.data.results) {
//                 setResults(response.data.results);
//                 setTotalResults(response.data.meta?.count || 0);
//             } else {
//                 setError("No results found. Please try a different search term.");
//                 setResults([]);
//                 setTotalResults(0);
//             }
//         } catch (error) {
//             console.error("Search error:", error);
            
//             // Provide more specific error messages
//             if (error.response) {
//                 // The request was made and the server responded with a status code
//                 // that falls out of the range of 2xx
//                 const status = error.response.status;
//                 if (status === 429) {
//                     setError("Rate limit exceeded. Please try again in a few minutes.");
//                 } else if (status === 400) {
//                     setError("Invalid search parameters. Please check your filters.");
//                 } else if (status === 403) {
//                     setError("Access denied. Please check your API configuration.");
//                 } else if (status === 404) {
//                     setError("The search service is currently unavailable.");
//                 } else {
//                     setError(`Server error (${status}). Please try again later.`);
//                 }
//             } else if (error.request) {
//                 // The request was made but no response was received
//                 setError("No response from server. Please check your internet connection.");
//             } else {
//                 // Something happened in setting up the request that triggered an Error
//                 setError("An error occurred while searching. Please try again.");
//             }
            
//             setResults([]);
//             setTotalResults(0);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Debounce the search to avoid too many API calls
//     const debouncedSearch = _.debounce(() => {
//         if (searchQuery) {
//             searchWorks();
//         }
//     }, 500);

//     useEffect(() => {
//         debouncedSearch();
//         return () => {
//             debouncedSearch.cancel();
//         };
//     }, [searchQuery, page, filters]);

//     const handleSearch = (e) => {
//         e.preventDefault();
//         setPage(1);
//         searchWorks();
//     };

//     const handleFilterChange = (filterName, value) => {
//         setFilters(prev => ({
//             ...prev,
//             [filterName]: value
//         }));
//     };

//     const resetFilters = () => {
//         setFilters({
//             oa: false,
//             from_publication_date: '',
//             to_publication_date: '',
//             type: 'all',
//             sort: 'relevance'
//         });
//     };

//     return (
//         <div className={`openalex-search ${darkMode ? 'dark-mode' : ''}`}>
//             <h2 className="text-2xl font-bold mb-6 text-center">Academic Literature Search</h2>
            
//             <form onSubmit={handleSearch} className="search-form">
//                 <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search academic works..."
//                     className="search-input"
//                 />
//                 <button type="submit" className="search-button">
//                     Search
//                 </button>
//             </form>

//             <div className="filters-container">
//                 <div className="filters-header">
//                     <h3 className="text-lg font-semibold">Filters</h3>
//                     <button 
//                         type="button" 
//                         className="toggle-filters-btn"
//                         onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
//                     >
//                         {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
//                     </button>
//                 </div>
                
//                 <div className="filters">
//                     <label className="filter-item">
//                         <input
//                             type="checkbox"
//                             checked={filters.oa}
//                             onChange={(e) => handleFilterChange('oa', e.target.checked)}
//                         />
//                         <span>Open Access Only</span>
//                     </label>
//                 </div>

//                 {showAdvancedFilters && (
//                     <div className="advanced-filters">
//                         <div className="filter-group">
//                             <label className="filter-label">Publication Date</label>
//                             <div className="date-range">
//                                 <input
//                                     type="number"
//                                     placeholder="From Year"
//                                     value={filters.from_publication_date}
//                                     onChange={(e) => handleFilterChange('from_publication_date', e.target.value)}
//                                     min="1800"
//                                     max="2100"
//                                     className="date-input"
//                                 />
//                                 <span>to</span>
//                                 <input
//                                     type="number"
//                                     placeholder="To Year"
//                                     value={filters.to_publication_date}
//                                     onChange={(e) => handleFilterChange('to_publication_date', e.target.value)}
//                                     min="1800"
//                                     max="2100"
//                                     className="date-input"
//                                 />
//                             </div>
//                         </div>

//                         <div className="filter-group">
//                             <label className="filter-label">Publication Type</label>
//                             <select 
//                                 value={filters.type} 
//                                 onChange={(e) => handleFilterChange('type', e.target.value)}
//                                 className="filter-select"
//                             >
//                                 <option value="all">All Types</option>
//                                 <option value="journal-article">Journal Article</option>
//                                 <option value="book">Book</option>
//                                 <option value="book-chapter">Book Chapter</option>
//                                 <option value="dissertation">Dissertation</option>
//                                 <option value="dataset">Dataset</option>
//                             </select>
//                         </div>

//                         <div className="filter-group">
//                             <label className="filter-label">Sort By</label>
//                             <select 
//                                 value={filters.sort} 
//                                 onChange={(e) => handleFilterChange('sort', e.target.value)}
//                                 className="filter-select"
//                             >
//                                 <option value="relevance">Relevance</option>
//                                 <option value="cited_by_count:desc">Most Cited</option>
//                                 <option value="publication_date:desc">Newest</option>
//                                 <option value="publication_date:asc">Oldest</option>
//                             </select>
//                         </div>

//                         <button 
//                             type="button" 
//                             className="reset-filters-btn"
//                             onClick={resetFilters}
//                         >
//                             Reset Filters
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {error && (
//                 <div className="error-message">
//                     {error}
//                 </div>
//             )}

//             {loading && <div className="loading">Loading...</div>}

//             {results.length > 0 && (
//                 <div className="results">
//                     <h3 className="results-header">Results ({totalResults} total)</h3>
//                     {results.map((work) => (
//                         <div key={work.id} className="result-item">
//                             <h4>{work.title}</h4>
//                             <p>Authors: {work.authorships?.map(a => a.author.display_name).join(", ")}</p>
//                             <p>Publication Year: {work.publication_year}</p>
//                             <p>Citations: {work.cited_by_count}</p>
//                             <p>Type: {work.type}</p>
//                             {work.doi && (
//                                 <a href={`https://doi.org/${work.doi}`} target="_blank" rel="noopener noreferrer">
//                                     View DOI
//                                 </a>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {totalResults > 10 && (
//                 <div className="pagination">
//                     <button
//                         onClick={() => setPage(p => Math.max(1, p - 1))}
//                         disabled={page === 1}
//                     >
//                         Previous
//                     </button>
//                     <span>Page {page}</span>
//                     <button
//                         onClick={() => setPage(p => p + 1)}
//                         disabled={page * 10 >= totalResults}
//                     >
//                         Next
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OpenAlexSearch; 
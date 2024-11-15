import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Navbar";
import FilterSidebar from './FilterSidebar'; 
import Footer from "./Footer";
import ResearchStep from "./ResearchStep";
import AboutUs from "./AboutUs";
import AssessorsAndPublishers from "./AssessorsAndPublishers";
import OurServices from './OurServices';
import JournalSuggester from './JournalSuggester';
import JournalMetrics from "./JournalMetrics";
import UrlDetection from './UrlDetection';
// import Chatbot from "./ChatBot";
// import StatsChart from './StatsChart'; // Import your stats chart component
// import CredibilityScore from './CredibilityScore'; // Import your credibility score component

import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [filters, setFilters] = useState({
    country: '',
    subjectArea: '',
    publicationYear: ''
  });

  // Function to handle search action
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const url = new URL(`http://127.0.0.1:5000/api/journal?title=${encodeURIComponent(searchQuery)}`);
      const response = await fetch(url);

      Object.keys(filters).forEach(key => filters[key] && url.searchParams.append(key, filters[key]));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data);

      if (data.error && data.error.includes("not found")) {
        setResults({ status: "Not Scopus Indexed" });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults({ status: "Not Scopus Indexed" });
    }
  };

  // Handle input change and fetch suggestions
  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/journal/suggestions?title=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

    // Handle filter input
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };
  // Function to handle keypress events (Enter key triggers search)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Router>
      <div className={`App ${darkMode ? 'bg-[#060415] text-white' : 'bg-white text-black'}`} style={{
        backgroundImage: darkMode
          ? 'linear-gradient(160deg, #060415 0%, #0f1f3a 33%, #0b1332 66%, #0b0b34 100%)'
          : 'linear-gradient(315deg, #f1f1f1 0%, #ffffff 24%, #e0e2ef 49%, #ffffff 75%, #ffffff 100%)'
      }}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={
            <>
              {/* Slogan Section */}
              <div className="bg-cover bg-center h-60 flex items-center justify-center">
                <h1 className={`text-5xl font-bold text-center p-6`}>
                  Your Trusted Partner<br />for Genuine Research Platforms and Publishers
                </h1>
              </div>

              {/* Centered Search Section */}
              <div className="flex justify-center items-center mt-10">
                <div className="container mx-auto p-10 relative">
                  <h2 className="text-2xl font-bold text-center mb-4">SEARCH FOR A JOURNAL</h2>
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

                                    {/* Filter Options */}
 
                                    <div className="mt-4 flex flex-wrap justify-center gap-4">
                                    <select name="country" onChange={handleFilterChange} className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>

                    <select name="country" className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                      <option value="Paid/Free">Paid/Free</option>
                      <option value="Paid">Paid</option>
                      <option value="Free">Free</option>
                    </select>
                    <select name="subjectArea" onChange={handleFilterChange} className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                      <option value="">Subject Area</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Medicine">Medicine</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                    <select name="indexing" onChange={handleFilterChange} className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                      <option value="">Indexing</option>
                      <option value="Scopus">Scopus</option>
                      <option value="UGC">UGC Care</option>
                      <option value="WoS">Web of Science</option>
                    </select>
                    <select name="publicationYear" onChange={handleFilterChange} className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
                      <option value="">Publication Year</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                    </select>
                    <button onClick={handleSearch} className="px-4 py-2 rounded-md bg-green-500 text-white">Apply Filters</button>
                  </div> 
{/* Results Section */}
{results && (
  <div className={`mt-6 p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border border-gray-300`}>
    <h2 className="text-lg font-bold">Results:</h2>
    
    {results.status === "Not Scopus Indexed" ? (
      <p>Status: <span className="text-red-500">{results.status}</span></p>
    ) : (
      <>
        <p>Title: {results.journal_title}</p>
        <p>ISSN: {results.issn}</p>
        <p>Publisher: {results.publisher}</p>
        <p>Status: <span className="text-green-500">{results.status}</span></p>
        
        {/* Coverage Years Information */}
        {results.coverage_years && (
          <p>
            Years covered by Scopus: {results.coverage_years}
          </p>
        )}

        {/* Discontinued Date Information */}
        {results.discontinued_date ? (
          <p>
            Discontinued Date: <span className="text-orange-500">{results.discontinued_date}</span>
          </p>
        ) : (
          <p>Currently Active</p>
        )}

        {/* Link to the journal */}
        {results.redirect_links && results.redirect_links.length > 0 && (
          <p>
            Link: <a href={results.redirect_links[0]?.href} target="_blank" rel="noopener noreferrer" className="text-blue-500">Visit Journal</a>
          </p>
        )}

        {/* Credibility Score and Rating */}
        {/* <div className="mt-4">
          <h3 className="text-lg font-semibold">Credibility:</h3>
          {results.credibility_score != null ? (
            <>
              <p>Score: <span className="text-blue-500">{results.credibility_score}</span></p>
              <p>Rating: <span className={`font-semibold ${results.credibility_rating === 'High' ? 'text-green-500' : results.credibility_rating === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                {results.credibility_rating}
              </span></p>
            </>
          ) : (
            <p className="text-gray-500">Credibility data is not available for this journal.</p>
          )}
        </div> */}
      </>
    )}
  </div>
  
)}




                </div>
              </div>

              {/* Include the About Us and Assessors and Publishers Sections */}
              <AboutUs darkMode={darkMode} />
              <OurServices />
              <AssessorsAndPublishers darkMode={darkMode} />
              {/* <Chabot/> */}
            </>
          } />
           {/* <Route path="/research-steps" element={
            <div className="container mx-auto mt-10 p-6">
              <h2 className={`text-3xl font-bold text-center ${darkMode ? 'text-white' : 'text-black'}`}></h2>
              <ResearchStep /> 
              
            </div>
          } /> */}
          <Route path="/research-steps" element={<ResearchStep/>} />
          <Route path="/journal-suggester" element={<JournalSuggester />} />
          <Route path="/url-detection" element={<UrlDetection />} />
          <Route path="/journal-metrics" element={<JournalMetrics />} />
        
          
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

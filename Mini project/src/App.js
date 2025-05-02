import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import ResearchStep from "./ResearchStep";
import ArticleChecker from "./ArticleChecker";
import JournalMetrics from "./JournalMetrics";
import UrlDetection from "./UrlDetection";
import OpenAlexSearch from "./components/OpenAlexSearch";
import AcademicSearch from "./pages/AcademicSearch";
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <Router>
      <div className={`App ${darkMode ? 'bg-[#060415] text-white' : 'bg-white text-black'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/research-steps" element={<ResearchStep darkMode={darkMode} />} />
          <Route path="/check-article" element={<ArticleChecker />} />
          <Route path="/ai-tools" element={<UrlDetection />} />
          <Route path="/journal-compare" element={<JournalMetrics />} />
          <Route path="/search" element={<OpenAlexSearch darkMode={darkMode} />} />
          <Route path="/academic-search" element={<AcademicSearch darkMode={darkMode} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
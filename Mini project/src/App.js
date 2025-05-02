import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import ResearchStep from "./ResearchStep";
import ArticleChecker from "./ArticleChecker";
import JournalMetrics from "./JournalMetrics";
import UrlDetection from "./UrlDetection";
import AcademicSearch from "./pages/AcademicSearch";
import Chat from "./components/Chat";
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
          <Route path="/check-article" element={<ArticleChecker darkMode={darkMode} />} />
          <Route path="/ai-tools" element={<UrlDetection darkMode={darkMode} />} />
          <Route path="/journal-compare" element={<JournalMetrics darkMode={darkMode} />} />
          <Route path="/academic-search" element={<AcademicSearch darkMode={darkMode} />} />
        </Routes>
        <Chat />
        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
}

export default App;
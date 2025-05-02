import React, { useState } from 'react';

const ArticleChecker = () => {
  const [inputName, setInputName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    setInputName(e.target.value);
  };

  const handleCheck = async () => {
    if (!inputName.trim()) {
      setError('Please enter keywords to search');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setSuggestions([]);
    setShowSuggestions(false);

    try {
      const response = await fetch('http://localhost:5000/api/check-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inputName }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || 'Error fetching data. Please try again.');
        return;
      }

      const data = await response.json();

      if (data.exists) {
        setResult(data.details);
      } else {
        // Parse the keywords to generate relevant suggestions
        const keywords = inputName.split(/[,\s]+/).filter(k => k.length > 2);
        
        // If API returns suggestions, use them
        if (data.suggestions) {
          if (typeof data.suggestions === 'string') {
            setSuggestions(generateRelevantSuggestions(keywords, data.suggestions));
          } else if (Array.isArray(data.suggestions)) {
            setSuggestions(data.suggestions);
          } else {
            setSuggestions(generateDynamicSuggestions(keywords));
          }
        } else {
          // Generate suggestions based on keywords
          setSuggestions(generateDynamicSuggestions(keywords));
        }
        
        setShowSuggestions(true);
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Process API suggestion string to make it relevant to keywords
  const generateRelevantSuggestions = (keywords, suggestionText) => {
    // Try to extract suggestion items if they're in a structured format
    let extractedSuggestions = [];
    
    try {
      // Try parsing as JSON first
      extractedSuggestions = JSON.parse(suggestionText);
    } catch {
      // If not JSON, try to extract using regex patterns
      const suggestionPattern = /["']([^"']+)["'][\s-]*([^"'\n]+)/g;
      const matches = [...suggestionText.matchAll(suggestionPattern)];
      
      if (matches.length > 0) {
        extractedSuggestions = matches.map((match, idx) => ({
          id: idx + 1,
          title: match[1].trim(),
          description: match[2].trim()
        }));
      }
    }
    
    // If we extracted structured suggestions, return them
    if (Array.isArray(extractedSuggestions) && extractedSuggestions.length > 0) {
      return extractedSuggestions;
    }
    
    // Otherwise generate dynamic suggestions based on keywords
    return generateDynamicSuggestions(keywords);
  };
  
  // Generate dynamic suggestions based on user's keywords
  const generateDynamicSuggestions = (keywords) => {
    const mainKeywords = keywords.length > 0 ? keywords : [inputName];
    
    // Templates for different types of research papers
    const templates = [
      {
        title: "Applying %s Detection using Neural Networks and %s: A Novel Approach to Cybersecurity",
        description: "In this article, you could explore how machine learning algorithms and %s technology can be used to detect and prevent advanced persistent threats (APTs) and other types of cognitive hacking attacks."
      },
      {
        title: "Decentralized Data Science: How %s and %s Can Revolutionize the Data Science Ecosystem",
        description: "This article could delve into the potential of %s and %s to transform the data science landscape by enabling decentralized data sharing, secure data transactions, and more efficient data processing."
      },
      {
        title: "%s Forensics using %s and Machine Learning: A New Frontier in Financial Crime Detection",
        description: "Explore the intersection of %s, digital forensics, and machine learning algorithms to detect and prevent financial crimes in cryptocurrency ecosystems."
      },
      {
        title: "Enhancing Privacy in %s Systems through Advanced %s Techniques",
        description: "This research could investigate how privacy-preserving techniques can be integrated with %s systems to maintain data utility while protecting sensitive information."
      },
      {
        title: "Smart Contract Vulnerability Detection using %s and %s",
        description: "Investigate how %s methods can be combined with %s technologies to automatically detect and mitigate vulnerabilities in blockchain smart contracts."
      }
    ];
    
    // Domains related to common tech research areas
    const domains = [
      "Blockchain", "Cryptography", "Artificial Intelligence", "Machine Learning", 
      "Neural Networks", "Quantum Computing", "Data Science", "Cybersecurity",
      "Deep Learning", "Distributed Systems", "Edge Computing", "IoT"
    ];
    
    // Filter domains to prioritize ones mentioned in user input
    const prioritizedDomains = domains.filter(domain => 
      mainKeywords.some(keyword => 
        domain.toLowerCase().includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(domain.toLowerCase())
      )
    );
    
    // Use both user keywords and relevant domains for substitution
    const allTerms = [...mainKeywords, ...prioritizedDomains].filter((v, i, a) => a.indexOf(v) === i);
    
    // Generate suggestions using templates and keywords
    return templates.map((template, idx) => {
      // Pick terms for substitution
      const term1 = allTerms[idx % allTerms.length];
      const term2 = allTerms[(idx + 1) % allTerms.length];
      const term3 = allTerms[(idx + 2) % allTerms.length] || term1;
      
      // Format title and description
      const title = template.title
        .replace(/%s/, term1)
        .replace(/%s/, term2);
        
      const description = template.description
        .replace(/%s/, term1)
        .replace(/%s/, term2)
        .replace(/%s/, term3);
        
      return {
        id: idx + 1,
        title: title,
        description: description
      };
    });
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="article-checker-container">
        <h1 className="title">Article/Journal Checker</h1>
        <p className="subtitle">Search by keywords to check existence in Scopus database</p>

        <textarea
          value={inputName}
          onChange={handleInputChange}
          rows={3}
          className="input-textarea"
          placeholder="Cryptography, Blockchain, AIML"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="check-button"
        >
          {loading ? 'Checking...' : 'Check Existence'}
        </button>

        {result && (
          <div className="result-container">
            <h3 className="result-title">Found in Database:</h3>
            <div className="result-card">
              <p><strong>Name:</strong> {result.name}</p>
              {result.publisher && <p><strong>Publisher:</strong> {result.publisher}</p>}
              {result.abstract && <p><strong>Abstract:</strong> {result.abstract}</p>}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="suggestions-container">
            <p className="not-found">Not found in database</p>
            <button onClick={toggleSuggestions} className="suggestions-button">
              {showSuggestions ? 'Hide Suggestions' : 'View Suggestions'}
            </button>
          </div>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-section">
            <div className="suggestions-card">
              <h3 className="suggestions-title">Suggestions:</h3>
              <p className="suggestion-intro">What a fascinating topic! Here are some potential article suggestions that may not be well-covered in academic databases:</p>
              <div className="suggestion-list">
                {suggestions.slice(0, Math.max(5, suggestions.length)).map((suggestion, index) => (
                  <div key={index} className="suggestion-item">
                    <div className="suggestion-title">"{suggestion.title}"</div>
                    <div className="suggestion-description">{suggestion.description}</div>
                    <div className="suggestion-tag">Research avenue for {inputName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <style jsx>{`
          .article-checker-container {
            background: #1a252f;
            border-radius: 10px;
            padding: 40px;
            max-width: 800px;
            margin: 40px auto;
            color: #ffffff;
            font-family: Arial, sans-serif;
          }

          .title {
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
          }

          .subtitle {
            font-size: 1rem;
            text-align: center;
            color: #a0a0a0;
            margin-bottom: 20px;
          }

          .input-textarea {
            width: 100%;
            background: #2a3b47;
            border: 2px solid #00b7eb;
            border-radius: 5px;
            padding: 10px;
            color: #ffffff;
            font-size: 1rem;
            resize: none;
            margin-bottom: 20px;
          }

          .input-textarea::placeholder {
            color: #a0a0a0;
          }

          .input-textarea:focus {
            outline: none;
            border-color: #00b7eb;
          }

          .check-button {
            width: 100%;
            background: #00b7eb;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            padding: 12px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s;
          }

          .check-button:hover:not(:disabled) {
            background: #0099cc;
          }

          .check-button:disabled {
            background: #666;
            cursor: not-allowed;
          }

          .result-container {
            margin-top: 20px;
          }

          .result-title {
            font-size: 1.5rem;
            margin-bottom: 10px;
          }

          .result-card {
            background: #2a3b47;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #00b7eb;
          }

          .result-card p {
            margin: 5px 0;
            color: #e0e0e0;
          }

          .suggestions-container {
            margin-top: 20px;
            text-align: center;
          }

          .not-found {
            color: #ff6666;
            font-size: 1.1rem;
            margin-bottom: 10px;
          }

          .suggestions-button {
            padding: 10px 20px;
            background: #ff6666;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
          }

          .suggestions-button:hover {
            background: #ff4d4d;
          }

          .suggestions-section {
            margin-top: 25px;
            animation: fadeIn 0.4s ease;
          }

          .suggestions-card {
            background: #2a3b47;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #ff6666;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          }

          .suggestions-title {
            color: #ff6666;
            font-size: 1.5rem;
            margin-top: 0;
            margin-bottom: 15px;
          }

          .suggestion-intro {
            color: #e0e0e0;
            margin-bottom: 20px;
            line-height: 1.5;
          }

          .suggestion-list {
            padding: 0;
            margin: 0;
          }

          .suggestion-item {
            margin-bottom: 25px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 5px;
            border-left: 3px solid #00b7eb;
          }

          .suggestion-title {
            color: #00b7eb;
            font-weight: bold;
            font-size: 1.1rem;
            margin-bottom: 8px;
          }

          .suggestion-description {
            color: #e0e0e0;
            line-height: 1.5;
            margin-bottom: 10px;
          }
          
          .suggestion-tag {
            display: inline-block;
            background: rgba(0, 183, 235, 0.15);
            color: #a0a0a0;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.8rem;
            margin-top: 5px;
          }

          .error {
            color: #ff6666;
            margin-top: 20px;
            text-align: center;
            font-size: 1rem;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ArticleChecker;
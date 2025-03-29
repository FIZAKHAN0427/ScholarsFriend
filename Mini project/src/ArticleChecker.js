import React, { useState } from 'react';

const ArticleChecker = () => {
  const [inputName, setInputName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // New state for the message

  const handleInputChange = (e) => {
    setInputName(e.target.value);
  };

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setMessage(''); // Reset message

    try {
      const response = await fetch('http://localhost:5000/api/check-google-scholar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inputName }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || 'Something went wrong');
        return;
      }

      const data = await response.json();

      // Set the message and results from the backend response
      if (data.message) {
        setMessage(data.message);
      }
      if (data.results) {
        setResult(data.results);
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#2D336B',
        color: '#e0e0e0',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        maxWidth: '800px',
        margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <h1 style={{ color: '#ffffff', textAlign: 'center', fontSize: '3rem' }}>
        Article/Journal Checker
      </h1>
      <p style={{ marginBottom: '20px', textAlign: 'center' }}>
        Check if an article or journal with a similar name already exists in the database.
      </p>

      <textarea
        value={inputName}
        onChange={handleInputChange}
        rows={3}
        style={{
          width: '100%',
          maxWidth: '600px',
          padding: '12px',
          marginBottom: '15px',
          borderRadius: '5px',
          border: '1px solid #00bcd4',
          backgroundColor: '#333333',
          color: '#ffffff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        }}
        placeholder="Enter the name of the article or journal here..."
      />
      <button
        onClick={handleCheck}
        disabled={loading}
        style={{
          padding: '12px 25px',
          backgroundColor: '#00bcd4',
          color: '#ffffff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background 0.3s',
          width: '100%',
          maxWidth: '600px',
          marginBottom: '20px',
        }}
      >
        {loading ? 'Checking...' : 'Check for Similar Names'}
      </button>

      {/* Display the message */}
      {message && (
        <p
          style={{
            color: message.includes('No exact or similar matches found') ? '#00bcd4' : '#ff4444',
            marginTop: '20px',
            textAlign: 'center',
          }}
        >
          {message}
        </p>
      )}

      {/* Display the results */}
      {result && (
        <div style={{ width: '100%', maxWidth: '600px', marginTop: '20px' }}>
          <h3 style={{ color: '#ffffff' }}>Results:</h3>
          {result.map((article, index) => (
            <div
              key={index}
              style={{
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#333333',
                borderRadius: '5px',
              }}
            >
              <p style={{ color: '#ffffff' }}>
                <strong>Title:</strong> {article.title}
              </p>
              <p style={{ color: '#ffffff' }}>
                <strong>Author:</strong> {article.author}
              </p>
              <p style={{ color: '#ffffff' }}>
                <strong>Year:</strong> {article.year}
              </p>
              <p style={{ color: '#ffffff' }}>
                <strong>URL:</strong>{' '}
                <a href={article.url} style={{ color: '#00bcd4' }}>
                  {article.url}
                </a>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Display errors */}
      {error && <p style={{ color: '#ff4444', marginTop: '20px' }}>{error}</p>}
    </div>
  );
};

export default ArticleChecker;
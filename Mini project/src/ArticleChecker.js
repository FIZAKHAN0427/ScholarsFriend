import React, { useState } from 'react';

const ArticleChecker = () => {
  const [inputName, setInputName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setInputName(e.target.value);
  };

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/check-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inputName }),
      });

      const data = await response.json();
      if (data.similar) {
        setResult(data.similar);
      } else {
        setError('No similar articles or journals found.');
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1c1c1c',
      color: '#e0e0e0',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      maxWidth: '800px',
      margin: '40px auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'all 0.3s ease',
    }}>
      <h1 style={{ color: '#ffffff', textAlign: 'center', fontSize: "3rem" }}>Article/Journal Checker</h1>
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
      <button onClick={handleCheck} disabled={loading} style={{
        padding: '12px 25px',
        backgroundColor: '#00bcd4',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background 0.3s',
        width: '100%',
        maxWidth: '600px',
      }}>
        {loading ? 'Checking...' : 'Check for Similar Names'}
      </button>

      {loading && <p style={{ color: '#00bcd4' }}>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{
          marginTop: '20px',
          width: '100%',
          textAlign: 'left',
        }}>
          <h3 style={{ color: '#00bcd4' }}>Similar Article/Journal Found:</h3>
          <div style={{
            marginBottom: '10px',
            padding: '15px',
            border: '1px solid #00bcd4',
            borderRadius: '5px',
            backgroundColor: '#2a2a2a',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            transition: 'transform 0.2s',
          }}>
            <strong style={{ color: '#ffffff' }}>{result.name}</strong>
            <p style={{ color: '#cccccc' }}>{result.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleChecker;

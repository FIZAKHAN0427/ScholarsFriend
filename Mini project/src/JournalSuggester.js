import React, { useState } from 'react';

const JournalSuggester = () => {
  const [abstract, setAbstract] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setAbstract(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ abstract }),
      });

      const data = await response.json();
      if (data.journals) {
        setSuggestions(data.journals);
      } else {
        setError('No journals found');
      }
    } catch (err) {
      setError('Error fetching journal suggestions');
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
      <h1 style={{ color: '#ffffff', textAlign: 'center', fontSize : "3rem"}}>Journal Suggester</h1>
      <p style={{ marginBottom: '20px', textAlign: 'center' }}>Helping you find the best home for your research article</p>
      <h2 style={{ color: '#00bcd4' }}>There are two easy steps</h2>
      <ol style={{ paddingLeft: '20px', marginBottom: '20px' }}>
        <li>Paste in the full abstract of your article, or several relevant keywords.</li>
        <li>Click on 'Reveal suggested journals' to see journal details.</li>
      </ol>

      <textarea
        value={abstract}
        onChange={handleInputChange}
        rows={5}
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
        placeholder="Paste your abstract or keywords here..."
      />
      <button onClick={handleSubmit} disabled={loading} style={{
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
        Reveal Suggested Journals
      </button>

      {loading && <p style={{ color: '#00bcd4' }}>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {suggestions.length > 0 && (
        <div style={{ marginTop: '20px', width: '100%' }}>
          <h3 style={{ color: '#00bcd4' }}>Suggested Journals</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
            {suggestions.map((journal, index) => (
              <li key={index} style={{
                marginBottom: '10px',
                padding: '15px',
                border: '1px solid #00bcd4',
                borderRadius: '5px',
                backgroundColor: '#2a2a2a',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                transition: 'transform 0.2s',
              }}>
                <strong style={{ color: '#ffffff' }}>{journal.title}</strong> - {journal.description}
                <p style={{ color: '#cccccc' }}>Citations: {journal.citations}, Speed: {journal.speed}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3 style={{ color: '#00bcd4' }}>Questions about the suggester?</h3>
      <p>The Journal Suggester uses artificial intelligence to match the subjects covered in your article.</p>
    </div>
  );
};

export default JournalSuggester;

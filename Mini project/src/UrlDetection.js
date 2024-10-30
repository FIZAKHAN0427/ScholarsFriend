import React, { useState } from 'react';

const UrlDetection = () => {
  const [url, setUrl] = useState('');
  const [prediction, setPrediction] = useState('');
  const [buttonVisibility, setButtonVisibility] = useState({ button1: false, button2: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      displayPrediction(data.prediction);
    } catch (error) {
      console.error('Error:', error);
      setPrediction("An error occurred. Please try again.");
    }
  };

  const displayPrediction = (x) => {
    if (isNaN(x) || x === -1) {
      setPrediction("Please enter a URL to check.");
      setButtonVisibility({ button1: false, button2: false });
    } else {
      let num = x * 100;
      if (0 <= x && x < 0.50) {
        num = 100 - num;
        setPrediction(`Website is ${num.toFixed(2)}% unsafe to use...`);
        setButtonVisibility({ button1: false, button2: true });
      } else if (x <= 1 && x >= 0.50) {
        setPrediction(`Website is ${num.toFixed(2)}% safe to use...`);
        setButtonVisibility({ button1: true, button2: false });
      }
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a192f, #1c1c3f)',
      padding: '20px',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      padding: '20px',
      width: '100%',
      maxWidth: '400px',
    },
    heading: {
      textAlign: 'center',
      fontSize: '2em',
      color: '#ffffff',
      marginBottom: '10px',
    },
    input: {
      border: '1px solid #007acc',
      borderRadius: '6px',
      padding: '10px',
      marginBottom: '10px',
      width: '100%',
      fontSize: '1em',
    },
    button: {
      background: '#007acc',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      padding: '10px',
      cursor: 'pointer',
      transition: 'background 0.3s',
      fontWeight: 'bold',
      width: '100%',
    },
    predictionText: {
      textAlign: 'center',
      fontSize: '1.2em',
      color: '#ffffff',
      margin: '10px 0',
    },
    link: {
      color: '#00aaff',
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>FAKE JOURNAL URL DETECTION</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            style={styles.input}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            required
          />
          <button style={styles.button} type="submit">Check here</button>
        </form>
        <div>
          <h6 style={styles.predictionText}>
            {url && <a href={url} target="_blank" rel="noopener noreferrer" style={styles.link}>{url}</a>}
          </h6>
          <h3 style={styles.predictionText}>{prediction}</h3>
          {buttonVisibility.button2 && (
            <button style={{ ...styles.button, background: '#ff4136' }} onClick={() => window.open(url)}>Still want to Continue</button>
          )}
          {buttonVisibility.button1 && (
            <button style={{ ...styles.button, background: '#2ecc40' }} onClick={() => window.open(url)}>Continue</button>
          )}
        </div>
      </div>
      <p style={{ textAlign: 'center', color: '#ffffff', marginTop: '20px' }}>© ScholarsFriend</p>
    </div>
  );
};

export default UrlDetection;

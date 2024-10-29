import React, { useState } from 'react';
import './App.css'; // Assuming your CSS file is named styles.css

const UrlDetection = () => {
  const [url, setUrl] = useState('');
  const [prediction, setPrediction] = useState('');
  const [buttonVisibility, setButtonVisibility] = useState({ button1: false, button2: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Make API call or process URL here
    // Simulated response
    const simulatedResponse = Math.random(); // Replace this with your logic
    displayPrediction(simulatedResponse);
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

  return (
    <div className="container">
      <div className="row">
        <div className="form col-md" id="form1">
          <h2>FAKE JOURNAL URL DETECTION</h2>
          <br />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form__input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              required
            />
            <label htmlFor="url" className="form__label">URL</label>
            <button className="button" type="submit">Check here</button>
          </form>
        </div>

        <div className="col-md" id="form2">
          <br />
          <h6 className="right">{url && <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>}</h6>
          <br />
          <h3 id="prediction">{prediction}</h3>
          {buttonVisibility.button2 && (
            <button className="button2" onClick={() => window.open(url)} style={{ display: buttonVisibility.button2 ? 'block' : 'none' }}>Still want to Continue</button>
          )}
          {buttonVisibility.button1 && (
            <button className="button1" onClick={() => window.open(url)} style={{ display: buttonVisibility.button1 ? 'block' : 'none' }}>Continue</button>
          )}
        </div>
      </div>
      <br />
      <p>© ScholarsFriend</p>
    </div>
  );
};

export default UrlDetection;

// src/AssessorsAndPublishers.js
import React from 'react';

const AssessorsAndPublishers = ({ darkMode }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    backgroundImage: darkMode 
      ? 'linear-gradient(160deg, #060415 0%, #0f1f3a 33%, #0b1332 66%, #0b0b34 100%)' 
      : 'linear-gradient(315deg, #f1f1f1 0%, #ffffff 24%, #e0e2ef 49%, #ffffff 75%, #ffffff 100%)',
    color: darkMode ? '#e0e0e0' : '#333333',
  };

  const boxStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '800px',
    marginBottom: '40px',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 20px 20px rgba(1, 1, 1, 1)',
    backgroundColor: darkMode ? 'transparent' : '#E3F2FD', // Light background for light mode
  };

  return (
    <div style={containerStyle}>
      <h2 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '40px',
          transition: 'color 0.3s ease-in-out',
        }}>
        Understanding Assessors and Publishers in Research
      </h2>

      {/* Assessors Section */}
      <div style={boxStyle}>
        <div style={{ width: '50%', padding: '20px' }}>
          <h3 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '15px',
            }}>
            Assessors: Ensuring Research Quality
          </h3>
          <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>
            Assessors evaluate the credibility and quality of journals. They help researchers find trustworthy places to publish.
          </p>
          <ul style={{
              listStyleType: 'disc',
              paddingLeft: '20px',
              marginTop: '15px',
              fontSize: '0.9rem',
            }}>
            <li>Scopus: High-quality peer-reviewed journals.</li>
            <li>Web of Science: Rigorous journal assessment.</li>
            <li>UGC CARE: Ensures academic standards for Indian scholars.</li>
          </ul>
        </div>
        <div style={{ width: '50%', overflow: 'hidden' }}>
          <img 
            src="/images/IMG3.jpg" 
            alt="Assessors"
            style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }} 
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
      </div>

      {/* Publishers Section */}
      <div style={boxStyle}>
        <div style={{ width: '50%', overflow: 'hidden' }}>
          <img 
            src="/images/IMG4.jpg" 
            alt="Publishers"
            style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }} 
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
        <div style={{ width: '50%', padding: '20px' }}>
          <h3 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '15px',
            }}>
            Publishers: Shaping Research Output
          </h3>
          <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>
            Publishers play a crucial role in disseminating research. They ensure the research reaches a global audience.
          </p>
          <ul style={{
              listStyleType: 'disc',
              paddingLeft: '20px',
              marginTop: '15px',
              fontSize: '0.9rem',
            }}>
            <li>Quality Publishing: Ensures high visibility and credibility.</li>
            <li>Open Access: Provides free access to research for everyone.</li>
            <li>Impact Factor: A measure of journal quality based on citations.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssessorsAndPublishers;

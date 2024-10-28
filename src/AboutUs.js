// src/AboutUs.js
import React from 'react';

const AboutUs = ({ darkMode }) => {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '40px',
      backgroundImage: darkMode 
        ? 'linear-gradient(160deg, #0f1f3a, #001f3f)' 
        : 'linear-gradient(315deg, #f0f4ff, #e0f7fa)',
      color: darkMode ? '#ffffff' : '#333333',
      transition: 'background 0.5s ease',
      fontFamily: 'Arial, sans-serif',
    },
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '80%',
      maxWidth: '1200px',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      borderRadius: '20px',
      overflow: 'hidden',
      animation: 'fadeIn 1s ease',
    },
    content: {
      flex: 1,
      padding: '20px',
      animation: 'slideIn 0.6s ease',
    },
    title: {
      fontSize: '2.5em',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: darkMode ? '#FFDC00' : '#0074D9',
      textAlign: 'left',
    },
    description: {
      fontSize: '1.5em',
      lineHeight: '1.8',
      color: darkMode ? '#DDDDDD' : '#333333',
      textAlign: 'left',
    },
    image: {
      flex: 1,
      maxWidth: '500px',
      height: 'auto',
      margin: '30px',
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    '@keyframes slideIn': {
      from: { transform: 'translateX(-50px)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.flexContainer}>
        <img 
          src="/images/xoxo.jpg" 
          alt="About Us"
          style={styles.image} 
        />
        <div style={styles.content}>
          <h2 style={styles.title}>About Us</h2>
          <p style={styles.description}>
            Scholars Friend is a freely accessible platform designed for scholars, researchers, publishers, colleges, and universities. Our platform offers a streamlined search with filters for international journals, publishers, and research papers. We developed this portal to provide researchers with a comprehensive source of genuine information about various journals, complete with relevant indexing details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

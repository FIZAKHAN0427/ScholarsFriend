// src/OurServices.js
import React from 'react';

const OurServices = () => {
  const services = [
    {
      image: 'images/image3.png', // Replace with actual image path
      title: 'Verifies Indexing',
    },
    {
      image: 'images/image4.png', // Replace with actual image path
      title: 'Scholar AI',
    },
    {
      image: 'images/image5.png', // Replace with actual image path
      title: 'Citation Checker',
    },
    {
      image: 'images/image7.png', // Replace with actual image path
      title: 'Fake Site Identification',
    },
    {
      image: 'images/image8.png', // Replace with actual image path
      title: 'Keyword-Based Searching',
    },
    {
      image: 'images/image6.png', // Replace with actual image path
      title: 'AI Suggester',
    },
  ];

  const containerStyle = {
    backgroundColor: '#f9f9f9',
    padding: '40px 20px',
    textAlign: 'center',

  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '90px',
    color: '#333',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    transition: 'transform 0.2s',
  };

  const logoStyle = {
    maxWidth: '100%', // Adjust to fit within card
    height: 'auto',
    marginBottom: '15px',
  };

  const titleServiceStyle = {
    fontSize: '1.5rem',
    color: '#555',
    lineHeight: '1.5',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Our Services</h2>
      <div style={gridStyle}>
        {services.map((service, index) => (
          <div
            key={index}
            style={cardStyle}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img src={service.image} alt={service.title} style={logoStyle} />
            <p style={titleServiceStyle}>{service.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServices;

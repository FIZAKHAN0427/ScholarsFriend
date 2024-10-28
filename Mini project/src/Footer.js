// src/Footer.js
import React from 'react';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`flex justify-between items-center p-4 ${darkMode ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
      <div className="flex flex-col">
        <h4 className="text-lg font-bold">Contact Us</h4>
        <p>Phone: 9422704564</p>
        <p>Email: crce.ce.@gmail.com</p>
      </div>
      <div className="text-center">
        <p>&copy; {new Date().getFullYear()} All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;

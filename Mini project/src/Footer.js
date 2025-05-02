// src/Footer.js
import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'} flex flex-col md:flex-row justify-between items-center`}>
      <div className="mb-6 md:mb-0">
        <h4 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Get in Touch</h4>
        <div className="flex items-center mb-2">
          <FaPhoneAlt className="mr-3 text-lg" />
          <p>Phone: 9422704564</p>
        </div>
        <div className="flex items-center">
          <FaEnvelope className="mr-3 text-lg" />
          <p>Email: scholarsfriend@gmail.com</p>
        </div>
      </div>
      
      <div className="text-center mb-6 md:mb-0">
        <p className="text-sm">&copy; {new Date().getFullYear()} CRCE. All Rights Reserved.</p>
        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Privacy Policy | Terms of Service</p>
      </div>

      <div className="flex space-x-6">
        <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`} aria-label="Facebook"><FaFacebook className="text-2xl" /></a>
        <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-blue-300' : 'text-gray-600 hover:text-blue-500'}`} aria-label="Twitter"><FaTwitter className="text-2xl" /></a>
        <a href="#" className={`${darkMode ? 'text-gray-400 hover:text-blue-500' : 'text-gray-600 hover:text-blue-700'}`} aria-label="LinkedIn"><FaLinkedin className="text-2xl" /></a>
      </div>
    </footer>
  );
};

export default Footer;

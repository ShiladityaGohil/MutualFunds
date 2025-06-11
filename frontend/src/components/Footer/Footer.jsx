import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          © {currentYear} Fund Compass. All rights reserved.
        </div>
        <div className="footer-links">
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
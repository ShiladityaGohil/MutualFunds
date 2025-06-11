import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaListAlt, FaExchangeAlt, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} end>
          <FaHome className="nav-icon" />
          <span className="nav-text">Home</span>
        </NavLink>
        
        <NavLink to="/holdings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaListAlt className="nav-icon" />
          <span className="nav-text">Holdings</span>
        </NavLink>
        
        <NavLink to="/compare" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaExchangeAlt className="nav-icon" />
          <span className="nav-text">Compare Holdings</span>
        </NavLink>
        
        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaInfoCircle className="nav-icon" />
          <span className="nav-text">About</span>
        </NavLink>
        
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FaEnvelope className="nav-icon" />
          <span className="nav-text">Contact</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
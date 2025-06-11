import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaListAlt, FaExchangeAlt } from 'react-icons/fa';
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
      </div>
    </nav>
  );
};

export default Navigation;
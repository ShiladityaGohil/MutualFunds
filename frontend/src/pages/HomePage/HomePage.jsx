import React from 'react';
import { Link } from 'react-router-dom';
import { FaListAlt, FaExchangeAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AboutMutualFunds from '../../components/AboutMutualFunds/AboutMutualFunds';
import './HomePage.css';

const HomePage = () => {
  const featureCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="home-page">
      <motion.div 
        className="welcome-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Welcome to Fund Compass</h1>
        <p>Analyze and compare mutual fund holdings to make informed investment decisions</p>
        
        <motion.div 
          className="features-section"
          initial="hidden"
          animate="visible"
          variants={featureCardVariants}
        >
          <div className="feature-card">
            <FaListAlt className="feature-icon" />
            <h2>View Fund Holdings</h2>
            <p>Explore the complete holdings of any mutual fund</p>
            <Link to="/holdings" className="feature-btn">View Holdings</Link>
          </div>
          
          <div className="feature-card">
            <FaExchangeAlt className="feature-icon" />
            <h2>Compare Funds</h2>
            <p>Compare holdings between two mutual funds</p>
            <Link to="/compare" className="feature-btn">Compare Funds</Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <AboutMutualFunds />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
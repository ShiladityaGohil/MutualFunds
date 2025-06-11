import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaUsers, FaHistory, FaLightbulb } from 'react-icons/fa';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <motion.div 
        className="about-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>About Fund Compass</h1>
        
        <section className="about-section mission">
          <h2><FaLightbulb className="section-icon" /> Our Mission</h2>
          <p>
            Fund Compass was created with a simple mission: to empower investors with transparent, 
            easy-to-understand information about mutual fund holdings and their comparison. We believe that informed 
            investment decisions lead to better financial outcomes.
          </p>
        </section>
        
        <section className="about-section story">
          <h2><FaHistory className="section-icon" /> Our Story</h2>
          <p>
            Founded in 2025 by a team of finance professionals and software engineers, 
            Fund Compass emerged from our own frustrations with the lack of accessible tools 
            for comparing mutual fund portfolios. We noticed that while fund performance data 
            was readily available, detailed holdings information was often buried in lengthy 
            documents or behind paywalls.
          </p>
          <p>
            We set out to build a solution that makes it easy for anyone to see exactly what 
            they're investing in and how funds differ from one another, regardless of their 
            level of investment expertise.
          </p>
        </section>
        
        <section className="about-section what-we-do">
          <h2><FaChartLine className="section-icon" /> What We Do</h2>
          <p>
            Fund Compass provides tools that allow investors to:
          </p>
          <ul className="features-list">
            <li>View complete holdings of mutual funds in an intuitive format</li>
            <li>Compare two funds side-by-side to identify overlaps and differences</li>
            <li>Analyze sector allocations and top holdings at a glance</li>
            <li>Make more informed decisions about portfolio diversification</li>
          </ul>
          <p>
            Our data is regularly updated to ensure you have access to the most current 
            information available about fund compositions.
          </p>
        </section>
      </motion.div>
    </div>
  );
};

export default AboutPage;
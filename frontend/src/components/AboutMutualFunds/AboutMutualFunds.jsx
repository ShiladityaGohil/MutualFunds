import React from 'react';
import { FaInfoCircle, FaChartLine, FaFileAlt, FaChartBar, FaMoneyBillWave, FaLandmark, FaCoins } from 'react-icons/fa';
import './AboutMutualFunds.css';

const AboutMutualFunds = () => {
  return (
    <div className="about-mutual-funds">
      <h2 className="about-title">Learn About Mutual Funds</h2>
      
      <div className="info-cards">
        <div className="info-card">
          <div className="card-gradient"></div>
          <div className="card-icon">
            <FaInfoCircle />
          </div>
          <h3>What Are Mutual Funds?</h3>
          <p className="card-text">
            A mutual fund is a pool of money collected from many investors to invest in a 
            diversified portfolio of stocks, bonds, or other securities. Managed by professional 
            fund managers, mutual funds offer investors an easy way to participate in the 
            financial markets without having to pick and manage individual assets themselves.
          </p>
        </div>
        
        <div className="info-card">
          <div className="card-gradient"></div>
          <div className="card-icon">
            <FaChartLine />
          </div>
          <h3>Why Are Mutual Funds Important?</h3>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="check-icon">✓</div>
              <div className="benefit-content">
                <span className="benefit-title">Diversification</span> 
                <span className="benefit-desc">– Reduces risk by spreading investments across various assets</span>
              </div>
            </div>
            <div className="benefit-item">
              <div className="check-icon">✓</div>
              <div className="benefit-content">
                <span className="benefit-title">Professional Management</span> 
                <span className="benefit-desc">– Experts handle your investment decisions</span>
              </div>
            </div>
            <div className="benefit-item">
              <div className="check-icon">✓</div>
              <div className="benefit-content">
                <span className="benefit-title">Liquidity</span> 
                <span className="benefit-desc">– Easy to buy and sell at current market value</span>
              </div>
            </div>
            <div className="benefit-item">
              <div className="check-icon">✓</div>
              <div className="benefit-content">
                <span className="benefit-title">Accessibility</span> 
                <span className="benefit-desc">– Start investing with small amounts</span>
              </div>
            </div>
            <div className="benefit-item">
              <div className="check-icon">✓</div>
              <div className="benefit-content">
                <span className="benefit-title">Regulated</span> 
                <span className="benefit-desc">– Governed by SEBI (in India) or other authorities globally</span>
              </div>
            </div>
          </div>
          <p className="card-footer">
            Mutual funds are ideal for long-term wealth creation, goal-based investing, and retirement planning.
          </p>
        </div>
        
        <div className="info-card">
          <div className="card-gradient"></div>
          <div className="card-icon">
            <FaFileAlt />
          </div>
          <h3>What Are Mutual Fund Holdings?</h3>
          <p className="card-text">
            Every mutual fund holds a mix of financial instruments such as:
          </p>
          <ul className="holdings-list">
            <li>
              <span className="holding-icon"><FaChartBar /></span>
              <span className="holding-text">Stocks (equity)</span>
            </li>
            <li>
              <span className="holding-icon"><FaLandmark /></span>
              <span className="holding-text">Bonds (debt)</span>
            </li>
            <li>
              <span className="holding-icon"><FaMoneyBillWave /></span>
              <span className="holding-text">Money market instruments</span>
            </li>
            <li>
              <span className="holding-icon"><FaCoins /></span>
              <span className="holding-text">Cash</span>
            </li>
          </ul>
          <p className="card-text">
            These holdings determine the performance, risk level, and category of the mutual fund. 
            Understanding the holdings helps investors assess the sector exposure, top-performing 
            stocks, and fund strategy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMutualFunds;
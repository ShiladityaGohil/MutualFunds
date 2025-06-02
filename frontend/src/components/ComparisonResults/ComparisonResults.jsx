import React from 'react';
import './ComparisonResults.css';

const ComparisonResults = ({ data, onNewComparison }) => {
  const { fund1, fund2, common_holdings, total_common_holdings } = data;
  
  return (
    <div className="comparison-results">
      <div className="comparison-header">
        <h2 className="comparison-title">Comparison Results</h2>
        
        <div className="funds-cards">
          <div className="fund-card">
            <h3 title={fund1.fund_title}>{fund1.fund_title}</h3>
            <div className="holdings-badge">
              <span>{fund1.total_holdings}</span>
              <p>Total Holdings</p>
            </div>
          </div>
          
          <div className="common-holdings-badge">
            <span>{total_common_holdings}</span>
            <p>Common Holdings</p>
          </div>
          
          <div className="fund-card">
            <h3 title={fund2.fund_title}>{fund2.fund_title}</h3>
            <div className="holdings-badge">
              <span>{fund2.total_holdings}</span>
              <p>Total Holdings</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="holdings-table-container">
        {total_common_holdings > 0 ? (
          <>
            <div className="table-header">
              <div className="th company-name">Company Name</div>
              <div className="th fund1-weight">{fund1.fund_title} Weight (%)</div>
              <div className="th fund2-weight">{fund2.fund_title} Weight (%)</div>
              <div className="th sector">Sector</div>
            </div>
            
            <div className="table-body">
              {common_holdings.map((holding, index) => (
                <div className="table-row" key={index}>
                  <div className="td company-name" title={holding.company_name}>
                    {holding.company_name}
                  </div>
                  <div className={`td fund1-weight ${holding.fund1_weight >= 0 ? 'positive' : 'negative'}`} title={`${holding.fund1_weight.toFixed(2)}%`}>
                    {holding.fund1_weight.toFixed(2)}%
                  </div>
                  <div className={`td fund2-weight ${holding.fund2_weight >= 0 ? 'positive' : 'negative'}`} title={`${holding.fund2_weight.toFixed(2)}%`}>
                    {holding.fund2_weight.toFixed(2)}%
                  </div>
                  <div className="td sector" title={holding.sector_name}>
                    {holding.sector_name}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-holdings-message">
            <p>No common holdings found between these funds.</p>
          </div>
        )}
      </div>
      
      <div className="actions">
        <button className="new-comparison-btn" onClick={onNewComparison}>
          New Comparison
        </button>
      </div>
    </div>
  );
};

export default ComparisonResults;
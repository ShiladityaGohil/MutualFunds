import React, { useState, useEffect } from 'react';
import FundSearch from '../../components/FundSearch/FundSearch';
import './ComparePage.css';

const ComparePage = () => {
  const [showingResults, setShowingResults] = useState(false);
  
  // This function will be passed to FundSearch to track when results are shown
  const handleResultsVisibilityChange = (isShowingResults) => {
    setShowingResults(isShowingResults);
  };
  
  return (
    <div className="compare-page">
      {!showingResults && (
        <>
          <h2 className="page-title">Compare Fund Holdings</h2>
          <p className="page-description">
            Select two mutual funds to compare their holdings and see what they have in common.
          </p>
        </>
      )}
      <FundSearch onResultsVisibilityChange={handleResultsVisibilityChange} />
    </div>
  );
};

export default ComparePage;
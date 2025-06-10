import React, { useState, useEffect, useRef, useCallback } from 'react';
import { API_ENDPOINTS, apiClient } from '../../config/apiConfig';
import './HoldingsPage.css';

const HoldingsPage = () => {
  const [fundName, setFundName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [holdings, setHoldings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [dataError, setDataError] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  
  const handleFundChange = (e) => {
    const value = e.target.value;
    if (value.length <= 255) {
      setFundName(value);
      setSelectedFund(null);
      setValidationError('');
      
      if (value.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };
  

const debouncedFetchSuggestions = useCallback((query) => {
  if (query.trim().length < 1) return;
  
  setSearchLoading(true);
  
  const fetchData = async () => {
    try {
      // Use the apiClient instead of direct fetch
      const data = await apiClient.get(API_ENDPOINTS.SEARCH_FUNDS, { title: query });
      
      if (data.total_records > 0) {
        setSuggestions(data.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };
  
  fetchData();
}, []);
  
  // Apply debouncing to search
  useEffect(() => {
    if (fundName.length > 0) {
      // Clear any existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        debouncedFetchSuggestions(fundName);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setHighlightedIndex(-1);
    
    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fundName, debouncedFetchSuggestions]);
  
  const selectFund = (fund) => {
    setFundName(fund.fund_title);
    setSelectedFund(fund);
    setShowSuggestions(false);
    setSuggestions([]);
    setValidationError('');
    setHighlightedIndex(-1);
  };
  
  const clearFund = () => {
    setFundName('');
    setSelectedFund(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setValidationError('');
    setDataError('');
    setHighlightedIndex(-1);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0 || searchLoading) return;
    
    // Arrow Down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }
    // Arrow Up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }
    // Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        selectFund(suggestions[highlightedIndex]);
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
    }
  };
  
  const handleViewHoldings = async () => {
    if (!fundName.trim()) {
      setValidationError('Please enter a fund name');
      return;
    }
    
    if (!selectedFund) {
      setValidationError('Please select a fund from the suggestions');
      return;
    }
    
    setLoading(true);
    setValidationError('');
    setDataError('');
    setHoldings(null);
    
    try {
      // Use the apiClient and API_ENDPOINTS instead of hardcoded URL
      const data = await apiClient.get(API_ENDPOINTS.GET_FUND_HOLDINGS(selectedFund.search_id));
      
      if (!data || !data.holdings_data || data.holdings_data.length === 0) {
        setDataError('No holdings data found for this fund');
        setHoldings(null);
      } else {
        const formattedHoldings = {
          fund_title: data.fund_title,
          total_holdings: data.total_holdings,
          holdings: data.holdings_data.map(holding => ({
            company_name: holding.company_name,
            weight: holding.corpus_per || 0,
            sector_name: holding.sector_name,
            instrument_name: holding.instrument_name
          }))
        };
        
        setHoldings(formattedHoldings);
      }
      
      setTimeout(() => {
        const searchSection = document.querySelector('.search-section');
        const resultsSection = document.querySelector('.holdings-results');
        
        if (searchSection && resultsSection) {
          const searchRect = searchSection.getBoundingClientRect();
          const resultsRect = resultsSection.getBoundingClientRect();
          
          const midpointY = (searchRect.top + resultsRect.top) / 2;
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          const targetPosition = scrollTop + midpointY - (window.innerHeight / 2);
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    } catch (error) {
      console.error('Error fetching holdings:', error);
      setDataError('Failed to fetch holdings data. Please try again.');
      setHoldings(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-box')) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="holdings-page">
      <div className="page-header">
        <h2 className="page-title">View Fund Holdings</h2>
        <p className="page-description">
          Explore the complete portfolio of any mutual fund to see its stock allocations, 
          sector distribution, and investment weightage. Understanding a fund's holdings 
          helps you assess its risk profile and alignment with your investment goals.
        </p>
      </div>
      
      <div className="holdings-container">
        <div className="search-section">
          <div className="search-column">
            <label htmlFor="fund" className="search-label">Fund Name</label>
            <div className="search-box">
              <input 
                id="fund"
                type="text" 
                placeholder="Search for a fund..." 
                value={fundName}
                onChange={handleFundChange}
                onKeyDown={handleKeyDown}
                onClick={(e) => {
                  e.stopPropagation();
                  if (fundName && suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                maxLength={255}
                title={fundName}
                className={validationError ? 'error' : ''}
                ref={inputRef}
              />
              {fundName && <button className="clear-btn" onClick={clearFund}>×</button>}
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-list" onClick={(e) => e.stopPropagation()}>
                  {searchLoading ? (
                    <div className="suggestion-loading">Loading...</div>
                  ) : (
                    suggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className={`suggestion-item ${highlightedIndex === index ? 'highlighted' : ''}`}
                        onClick={() => selectFund(suggestion)}
                      >
                        {suggestion.fund_title}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            {validationError && (
              <div className="validation-error">{validationError}</div>
            )}
          </div>
          
          <button 
            className="view-holdings-btn" 
            onClick={handleViewHoldings}
            disabled={loading || !selectedFund}
          >
            {loading ? (
              <div className="button-loader">
                <div className="loader-spinner"></div>
                <span>Loading...</span>
              </div>
            ) : 'View Holdings'}
          </button>
        </div>
        
        <div className="holdings-results">
          {loading && (
            <div className="holdings-loading">
              <div className="loader-container">
                <div className="loader"></div>
                <p>Loading holdings data...</p>
              </div>
            </div>
          )}
          
          {!loading && dataError && (
            <div className="holdings-error">
              <p>{dataError}</p>
              <button 
                className="try-again-btn"
                onClick={handleViewHoldings}
              >
                Try Again
              </button>
            </div>
          )}
          
          {!loading && holdings && (
            <div className="holdings-card">
              <div className="holdings-header">
                <h3>{holdings.fund_title}</h3>
                <div className="holdings-badge">
                  <span className="total-holdings-count">{holdings.total_holdings}</span>
                  <p>Total Holdings</p>
                </div>
              </div>
              
              <div className="holdings-table-container">
                <div className="table-header">
                  <div className="th company-name">Company Name</div>
                  <div className="th weight">Assets (%)</div>
                  <div className="th sector">Sector</div>
                  <div className="th instrument">Instrument</div>
                </div>
                
                <div className="table-body">
                  {holdings.holdings.length > 0 ? (
                    holdings.holdings.map((holding, index) => (
                      <div className="table-row" key={index}>
                        <div className="td company-name">{holding.company_name || 'N/A'}</div>
                        <div className={`td weight ${holding.weight >= 0 ? 'positive' : 'negative'}`}>
                          {holding.weight !== undefined ? `${holding.weight.toFixed(2)}%` : 'N/A'}
                        </div>
                        <div className="td sector">{holding.sector_name || 'N/A'}</div>
                        <div className="td instrument">{holding.instrument_name || 'N/A'}</div>
                      </div>
                    ))
                  ) : (
                    <div className="no-data-row">
                      <div className="no-data-message">No holdings data available for this fund</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HoldingsPage;
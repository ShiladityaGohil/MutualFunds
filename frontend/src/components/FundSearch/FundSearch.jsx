import React, { useState, useEffect, useDeferredValue, useRef, useCallback } from 'react';
import './FundSearch.css';
import ComparisonResults from '../ComparisonResults/ComparisonResults';
import { API_ENDPOINTS, apiClient } from '../../config/apiConfig';

const FundSearch = ({ onResultsVisibilityChange }) => {
  const [fund1, setFund1] = useState('');
  const [fund2, setFund2] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    fund1: '',
    fund2: '',
    general: ''
  });
  const [searchLoading1, setSearchLoading1] = useState(false);
  const [searchLoading2, setSearchLoading2] = useState(false);
  const [selectedFund1, setSelectedFund1] = useState(null);
  const [selectedFund2, setSelectedFund2] = useState(null);
  const [highlightedIndex1, setHighlightedIndex1] = useState(-1);
  const [highlightedIndex2, setHighlightedIndex2] = useState(-1);
  
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const debounceTimerRef1 = useRef(null);
  const debounceTimerRef2 = useRef(null);
  const suggestionsRef1 = useRef(null);
  const suggestionsRef2 = useRef(null);
  
  // Use deferred values for smoother UI during search
  const deferredFund1 = useDeferredValue(fund1);
  const deferredFund2 = useDeferredValue(fund2);
  
  // Notify parent component when results visibility changes
  useEffect(() => {
    if (onResultsVisibilityChange) {
      onResultsVisibilityChange(comparisonData !== null);
    }
  }, [comparisonData, onResultsVisibilityChange]);
  
  const debouncedFetchSuggestions = useCallback((query, setSuggestions, setSearchLoading) => {
    if (query.trim().length < 1) return;
    
    setSearchLoading(true);
    
    const fetchData = async () => {
      try {
        const data = await apiClient.get(API_ENDPOINTS.SEARCH_FUNDS, { title: query });
        
        if (data.total_records > 0) {
          // Filter out duplicates based on search_id
          const uniqueFunds = data.data.filter((fund, index, self) =>
            index === self.findIndex((f) => f.search_id === fund.search_id)
          );
          setSuggestions(uniqueFunds);
        } else {
          setSuggestions([]);
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
  
  useEffect(() => {
    if (deferredFund1.length > 0) {
      // Clear any existing timer
      if (debounceTimerRef1.current) {
        clearTimeout(debounceTimerRef1.current);
      }
      
      // Set new timer
      debounceTimerRef1.current = setTimeout(() => {
        debouncedFetchSuggestions(deferredFund1, setSuggestions1, setSearchLoading1);
        setShowSuggestions1(true);
      }, 300);
    } else {
      setSuggestions1([]);
      setShowSuggestions1(false);
    }
    setHighlightedIndex1(-1);
    
    // Cleanup function
    return () => {
      if (debounceTimerRef1.current) {
        clearTimeout(debounceTimerRef1.current);
      }
    };
  }, [deferredFund1, debouncedFetchSuggestions]);
  
  useEffect(() => {
    if (deferredFund2.length > 0) {
      // Clear any existing timer
      if (debounceTimerRef2.current) {
        clearTimeout(debounceTimerRef2.current);
      }
      
      // Set new timer
      debounceTimerRef2.current = setTimeout(() => {
        debouncedFetchSuggestions(deferredFund2, setSuggestions2, setSearchLoading2);
        setShowSuggestions2(true);
      }, 300);
    } else {
      setSuggestions2([]);
      setShowSuggestions2(false);
    }
    setHighlightedIndex2(-1);
    
    // Cleanup function
    return () => {
      if (debounceTimerRef2.current) {
        clearTimeout(debounceTimerRef2.current);
      }
    };
  }, [deferredFund2, debouncedFetchSuggestions]);
  
  const handleFund1Change = (e) => {
    const value = e.target.value;
    if (value.length <= 255) {
      setFund1(value);
      setSelectedFund1(null);
      // Clear validation error when user starts typing
      setValidationErrors(prev => ({...prev, fund1: ''}));
      
      if (value.length === 0) {
        setSuggestions1([]);
        setShowSuggestions1(false);
      }
    }
  };
  
  const handleFund2Change = (e) => {
    const value = e.target.value;
    if (value.length <= 255) {
      setFund2(value);
      setSelectedFund2(null);
      // Clear validation error when user starts typing
      setValidationErrors(prev => ({...prev, fund2: ''}));
      
      if (value.length === 0) {
        setSuggestions2([]);
        setShowSuggestions2(false);
      }
    }
  };
  
  const handleKeyDown1 = (e) => {
    if (!showSuggestions1 || suggestions1.length === 0 || searchLoading1) return;
    
    // Arrow Down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex1(prev => 
        prev < suggestions1.length - 1 ? prev + 1 : 0
      );
    }
    // Arrow Up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex1(prev => 
        prev > 0 ? prev - 1 : suggestions1.length - 1
      );
    }
    // Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex1 >= 0 && highlightedIndex1 < suggestions1.length) {
        selectFund(suggestions1[highlightedIndex1], true);
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions1(false);
    } else if (e.key === 'Tab') {
      setShowSuggestions1(false);
    }
  };
  
  const handleKeyDown2 = (e) => {
    if (!showSuggestions2 || suggestions2.length === 0 || searchLoading2) return;
    
    // Arrow Down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex2(prev => 
        prev < suggestions2.length - 1 ? prev + 1 : 0
      );
    }
    // Arrow Up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex2(prev => 
        prev > 0 ? prev - 1 : suggestions2.length - 1
      );
    }
    // Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex2 >= 0 && highlightedIndex2 < suggestions2.length) {
        selectFund(suggestions2[highlightedIndex2], false);
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions2(false);
    } else if (e.key === 'Tab') {
      setShowSuggestions2(false);
    }
  };
  
  const selectFund = (fund, isFund1) => {
    if (isFund1) {
      setFund1(fund.fund_title);
      setSelectedFund1(fund);
      setShowSuggestions1(false);
      setSuggestions1([]);
      setHighlightedIndex1(-1);
      setValidationErrors(prev => ({...prev, fund1: ''}));
    } else {
      setFund2(fund.fund_title);
      setSelectedFund2(fund);
      setShowSuggestions2(false);
      setSuggestions2([]);
      setHighlightedIndex2(-1);
      setValidationErrors(prev => ({...prev, fund2: ''}));
    }
  };
  
  const clearFund1 = () => {
    setFund1('');
    setSelectedFund1(null);
    setSuggestions1([]);
    setShowSuggestions1(false);
    setHighlightedIndex1(-1);
  };
  
  const clearFund2 = () => {
    setFund2('');
    setSelectedFund2(null);
    setSuggestions2([]);
    setShowSuggestions2(false);
    setHighlightedIndex2(-1);
  };
  
  const resetComparison = () => {
    setComparisonData(null);
    setFund1('');
    setFund2('');
    setSelectedFund1(null);
    setSelectedFund2(null);
    setSuggestions1([]);
    setSuggestions2([]);
    setShowSuggestions1(false);
    setShowSuggestions2(false);
    setHighlightedIndex1(-1);
    setHighlightedIndex2(-1);
    setValidationErrors({
      fund1: '',
      fund2: '',
      general: ''
    });
  };

  const validateInputs = () => {
    let isValid = true;
    const errors = {
      fund1: '',
      fund2: '',
      general: ''
    };

    if (!selectedFund1) {
      errors.fund1 = 'Please select a fund from the suggestions';
      isValid = false;
    }

    if (!selectedFund2) {
      errors.fund2 = 'Please select a fund from the suggestions';
      isValid = false;
    }

    if (selectedFund1 && selectedFund2 && selectedFund1.search_id === selectedFund2.search_id) {
      errors.general = 'Please select two different funds to compare';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleCompare = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setLoading(true);
    setValidationErrors({
      fund1: '',
      fund2: '',
      general: ''
    });
    
    try {
      const data = await apiClient.get(API_ENDPOINTS.COMPARE_FUNDS, {
        fund1: selectedFund1.search_id,
        fund2: selectedFund2.search_id
      });
      
      setComparisonData(data);
    } catch (error) {
      console.error('Error comparing funds:', error);
      setValidationErrors(prev => ({
        ...prev,
        general: 'Failed to compare funds. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // For Fund 1
      if (showSuggestions1 && !input1Ref.current?.contains(e.target) && 
          !suggestionsRef1.current?.contains(e.target)) {
        setShowSuggestions1(false);
      }
      
      // For Fund 2
      if (showSuggestions2 && !input2Ref.current?.contains(e.target) && 
          !suggestionsRef2.current?.contains(e.target)) {
        setShowSuggestions2(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [showSuggestions1, showSuggestions2]);

  return (
    <div className="search-section">
      {!comparisonData ? (
        <>
          <div className="search-row">
            <div className="search-column">
              <label htmlFor="fund1" className="search-label">Fund 1</label>
              <div className="search-box">
                <input 
                  id="fund1"
                  type="text" 
                  placeholder="Search Fund 1..." 
                  value={fund1}
                  onChange={handleFund1Change}
                  onKeyDown={handleKeyDown1}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (fund1 && suggestions1.length > 0) {
                      setShowSuggestions1(true);
                    }
                  }}
                  maxLength={255}
                  title={fund1}
                  className={validationErrors.fund1 ? 'error' : ''}
                  ref={input1Ref}
                />
                {fund1 && <button className="clear-btn" onClick={clearFund1}>×</button>}
                
                {showSuggestions1 && (
                  <div 
                    className="suggestions-list" 
                    onClick={(e) => e.stopPropagation()}
                    ref={suggestionsRef1}
                  >
                    {searchLoading1 ? (
                      <div className="suggestion-loading">Loading...</div>
                    ) : suggestions1.length > 0 ? (
                      suggestions1.map((suggestion, index) => (
                        <div 
                          key={suggestion.search_id} 
                          className={`suggestion-item ${highlightedIndex1 === index ? 'highlighted' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectFund(suggestion, true);
                            setShowSuggestions1(false);
                          }}
                        >
                          {suggestion.fund_title}
                        </div>
                      ))
                    ) : (
                      <div className="suggestion-loading">No funds found</div>
                    )}
                  </div>
                )}
                
                {validationErrors.fund1 && (
                  <div className="validation-error">{validationErrors.fund1}</div>
                )}
              </div>
            </div>
            
            <div className="search-column">
              <label htmlFor="fund2" className="search-label">Fund 2</label>
              <div className="search-box">
                <input 
                  id="fund2"
                  type="text" 
                  placeholder="Search Fund 2..." 
                  value={fund2}
                  onChange={handleFund2Change}
                  onKeyDown={handleKeyDown2}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (fund2 && suggestions2.length > 0) {
                      setShowSuggestions2(true);
                    }
                  }}
                  maxLength={255}
                  title={fund2}
                  className={validationErrors.fund2 ? 'error' : ''}
                  ref={input2Ref}
                />
                {fund2 && <button className="clear-btn" onClick={clearFund2}>×</button>}
                
                {showSuggestions2 && (
                  <div 
                    className="suggestions-list" 
                    onClick={(e) => e.stopPropagation()}
                    ref={suggestionsRef2}
                  >
                    {searchLoading2 ? (
                      <div className="suggestion-loading">Loading...</div>
                    ) : suggestions2.length > 0 ? (
                      suggestions2.map((suggestion, index) => (
                        <div 
                          key={suggestion.search_id} 
                          className={`suggestion-item ${highlightedIndex2 === index ? 'highlighted' : ''}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectFund(suggestion, false);
                            setShowSuggestions2(false);
                          }}
                        >
                          {suggestion.fund_title}
                        </div>
                      ))
                    ) : (
                      <div className="suggestion-loading">No funds found</div>
                    )}
                  </div>
                )}
                
                {validationErrors.fund2 && (
                  <div className="validation-error">{validationErrors.fund2}</div>
                )}
              </div>
            </div>
          </div>
          
          {validationErrors.general && (
            <div className="general-validation-error">{validationErrors.general}</div>
          )}
          
          <button 
            className="compare-btn" 
            onClick={handleCompare}
            disabled={loading}
          >
            {loading ? (
              <div className="button-loader">
                <div className="loader-spinner"></div>
                <span>Comparing...</span>
              </div>
            ) : 'Compare'}
          </button>
        </>
      ) : (
        <ComparisonResults 
          data={comparisonData} 
          onNewComparison={resetComparison} 
        />
      )}
    </div>
  );
};

export default FundSearch;
/**
 * API Configuration
 * 
 * This file contains all API endpoints used in the application.
 * When deploying to different environments, only this file needs to be updated.
 */

// Base API URL - change this when deploying to production
const API_BASE_URL = 'http://127.0.0.1:9000/api/v1';

// API endpoints
const API_ENDPOINTS = {
  // Mutual Funds
  SEARCH_FUNDS: `${API_BASE_URL}/mutual-funds/search`,
  COMPARE_FUNDS: `${API_BASE_URL}/mutual-funds/compare-holdings`,
  GET_FUND_HOLDINGS: (fundId) => `${API_BASE_URL}/mutual-funds/${fundId}/holdings`,
};

/**
 * Builds a URL with query parameters
 * @param {string} url - Base URL
 * @param {Object} params - Query parameters
 * @returns {string} URL with query parameters
 */
const buildUrl = (url, params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

/**
 * API client with common fetch methods
 */
const apiClient = {
  /**
   * Perform a GET request
   * @param {string} url - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} - Response data
   */
  async get(url, params = {}) {
    try {
      const response = await fetch(buildUrl(url, params));
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  /**
   * Perform a POST request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise} - Response data
   */
  async post(url, data = {}) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
};

export { API_ENDPOINTS, apiClient };
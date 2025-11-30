import React, { useState, useEffect, useRef } from 'react';
import './MangaSearch.css';

const MangaSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  // FIX: Implement robust debouncing using useEffect
  useEffect(() => {
    // Only search if the term is non-empty after a delay
    if (searchTerm.trim().length > 0) {
      const handler = setTimeout(() => {
        onSearch(searchTerm);
      }, 500); // 500ms debounce

      return () => {
        clearTimeout(handler);
      };
    } else {
      // If the search term is empty, clear the search immediately
      onSearch(''); 
    }
  }, [searchTerm, onSearch]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    // Optionally focus the input again after clearing
    inputRef.current?.focus(); 
  };

  return (
    <div className="search-bar-container">
      {/* Search input is the main interactive field */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter a search query..."
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
      />
      {/* Clear button (X) */}
      {searchTerm && ( 
        <button className="clear-search-btn" onClick={handleClearSearch} aria-label="Clear search">
          {/* SVG for close/clear icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
      {/* Search icon (magnifying glass) - decorative/positional in this new style */}
      <div className="search-icon-wrapper">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>
  );
};

export default MangaSearch;
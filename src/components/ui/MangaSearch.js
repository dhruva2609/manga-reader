import React, { useState } from 'react';
import './MangaSearch.css';

const MangaSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form className={`search-bar-container${focused ? ' focused' : ''}`} onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Search manga title…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
      />
      {query && (
        <button
          type="button"
          className="clear-btn"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
      <button className="search-btn" type="submit" aria-label="Search">
        <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="9" r="7"/>
          <line x1="15" y1="15" x2="19" y2="19"/>
        </svg>
      </button>
    </form>
  );
};

export default MangaSearch;

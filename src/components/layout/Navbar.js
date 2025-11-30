import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import DarkModeToggle from "../ui/DarkModeToggle";
import MangaSearch from "../ui/MangaSearch";
import MangaList from "../manga/MangaList";
import "./Navbar.css";

const Navbar = ({ onSearch, mangas, loading, onSelectManga, clearSearchResults }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSelectAndClear = useCallback((manga) => {
    onSelectManga(manga.id); 
    clearSearchResults(); 
    setIsSearchFocused(false);
  }, [onSelectManga, clearSearchResults]);
  
  const showDropdown = isSearchFocused && (loading || (mangas && mangas.length > 0));

  return (
    <nav className="navbar">
      <div className="navbar-content-wrapper">
        
        {/* --- 1. Brand Section (Left) --- */}
        {/* We use a wrapper class to manage separation from links */}
        <NavLink to="/" className="navbar-brand-wrapper">
          <span className="navbar-brand">
            <span className="brand-accent">Manga</span>Reader
          </span>
        </NavLink>
        
        {/* --- 2. Navigation Links (Center) --- */}
        <div className="navbar-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSearchFocused(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/favorites" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSearchFocused(false)}
          >
            Favorites
          </NavLink>
          <NavLink 
            to="/history" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setIsSearchFocused(false)}
          >
            History
          </NavLink>
        </div>

        {/* --- 3. Search Bar & Actions (Right - Grouped for Alignment) --- */}
        {/* This wrapper ensures the search bar and toggle are vertically aligned and pushed to the right. */}
        <div className="navbar-search-actions">
            
            {/* Search Bar with Dropdown Results */}
            <div 
              className="navbar-search" 
              onFocus={() => setIsSearchFocused(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setTimeout(() => setIsSearchFocused(false), 150);
                }
              }}
            >
              <MangaSearch onSearch={onSearch} />
              
              {showDropdown && (
                <div className="search-results-dropdown">
                  {loading ? (
                    <div className="loader-small">Searching...</div>
                  ) : (
                    <MangaList 
                      mangas={mangas} 
                      onSelect={handleSelectAndClear} 
                    />
                  )}
                </div>
              )}
            </div>

            <div className="navbar-actions">
              <DarkModeToggle />
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import DarkModeToggle from "../ui/DarkModeToggle";
import MangaSearch from "../ui/MangaSearch";
import MangaList from "../manga/MangaList";
import "./Navbar.css";

const Navbar = ({ onSearch, mangas, loading, onSelectManga, clearSearchResults }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State for the full-screen mobile search overlay
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSelectAndClear = useCallback((manga) => {
    onSelectManga(manga); 
    clearSearchResults(); 
    setIsSearchFocused(false);
    // Close mobile search on selection
    setIsMobileSearchOpen(false);
  }, [onSelectManga, clearSearchResults]);
  
  const showDropdown = isSearchFocused && (loading || (mangas && mangas.length > 0));

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Toggle the mobile search overlay
  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(prev => !prev);
    // Close mobile menu if search is opened
    if (!isMobileSearchOpen) {
        setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      {/* Mobile Search Overlay: Appears when toggled, covering the header */}
      <div className={`mobile-search-overlay ${isMobileSearchOpen ? "open" : ""}`}>
        <div className="mobile-search-bar-wrapper">
          <MangaSearch onSearch={onSearch} />
        </div>
        <button className="mobile-search-close-btn" onClick={toggleMobileSearch} aria-label="Close search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        {/* Fix S2: Render search results inside the full-screen mobile overlay */}
        {(loading || (mangas && mangas.length > 0)) && (
          <div className="mobile-search-results">
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
      
      <div className="navbar-content-wrapper">
        
        {/* --- 1. Hamburger Menu (Mobile: Far Left) --- */}
        <div className="hamburger-menu" onClick={toggleMobileMenu}>
          <div className={`hamburger-icon ${isMobileMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        {/* --- 2. Brand Section (Mobile: Center/Left) --- */}
        <NavLink to="/" className="navbar-brand-wrapper">
          <span className="navbar-brand">
            <span className="brand-accent">Manga</span>Reader
          </span>
        </NavLink>
        
        {/* --- 3. FIX: Mobile Search Icon (Mobile: Next to brand) --- */}
        {/* This button must be placed here in the JSX flow to be next to the brand on mobile */}
        <button 
            className="mobile-search-icon" 
            onClick={toggleMobileSearch}
            aria-label="Toggle search"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="16.65" y1="16.65" x2="21" y2="21"/>
            </svg>
        </button>
        
        {/* --- 4. Central Search Bar (Desktop Only) --- */}
        <div 
          className="navbar-search" 
          onFocus={() => setIsSearchFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              // Fix B3: Simplify onBlur to avoid race conditions with debounced search
              setIsSearchFocused(false);
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
        
        {/* --- 5. Actions (Right: Links + Dark Mode) --- */}
        <div className="navbar-actions-wrapper">
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
            
            <div className="navbar-actions">
              {/* DarkModeToggle is here, which gets pushed far right on mobile */}
              <DarkModeToggle />
            </div>
        </div>
      </div>

      {/* --- Mobile Navigation Side Drawer --- */}
      <div className={`mobile-nav-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
            <span className="navbar-brand">
              <span className="brand-accent">Manga</span>Reader
            </span>
            <button className="mobile-close-btn" onClick={handleCloseMobileMenu} aria-label="Close menu">
              ×
            </button>
        </div>
        
        <div className="mobile-nav-links-wrapper">
            <NavLink to="/" className="mobile-nav-link" onClick={handleCloseMobileMenu}>Home</NavLink>
            <NavLink to="/favorites" className="mobile-nav-link" onClick={handleCloseMobileMenu}>Favorites</NavLink>
            <NavLink to="/history" className="mobile-nav-link" onClick={handleCloseMobileMenu}>History</NavLink>
        </div>
        
        {/* Fix A1: Removed redundant DarkModeToggle */}
      </div>
    </nav>
  );
};

export default Navbar;
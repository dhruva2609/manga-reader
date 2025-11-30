// ... existing code ...
import MangaSearch from "../ui/MangaSearch";
import MangaList from "../manga/MangaList";
import "./Navbar.css";

// SVG Icons for the new design
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const Navbar = ({ onSearch, mangas, loading, onSelectManga, clearSearchResults }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false); // New state for search overlay

  const handleSelectAndClear = useCallback((manga) => {
    onSelectManga(manga);
    clearSearchResults();
    setIsSearchFocused(false);
    setIsSearchOverlayOpen(false); // Close overlay on selection
  }, [onSelectManga, clearSearchResults]);

  const showDropdown = isSearchFocused && (loading || (mangas && mangas.length > 0));

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearchOverlay = () => {
    setIsSearchOverlayOpen(!isSearchOverlayOpen);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content-wrapper">
          {/* 1. Hamburger Menu (Left) */}
          <div className="navbar-action-item" onClick={toggleMobileMenu}>
            <MenuIcon />
          </div>

          {/* 2. Brand Section (Center) */}
          <NavLink to="/" className="navbar-brand-centered">
            <span className="navbar-brand">
              <span className="brand-accent">Manga</span>Dex
            </span>
          </NavLink>

          {/* 3. Action Icons (Right) */}
          <div className="navbar-actions-right">
            <div className="navbar-action-item" onClick={toggleSearchOverlay}>
              <SearchIcon />
            </div>
            <div className="navbar-action-item">
              <DarkModeToggle />
            </div>
          </div>
        </div>

        {/* --- Mobile Navigation Menu (Drawer) --- */}
        <div className={`mobile-nav-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/" className="mobile-nav-link" onClick={toggleMobileMenu}>Home</NavLink>
          <NavLink to="/favorites" className="mobile-nav-link" onClick={toggleMobileMenu}>Favorites</NavLink>
          <NavLink to="/history" className="mobile-nav-link" onClick={toggleMobileMenu}>History</NavLink>
        </div>
      </nav>

      {/* --- Search Overlay --- */}
      {isSearchOverlayOpen && (
        <div className="search-overlay">
          <div
            className="search-overlay-content"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setTimeout(() => setIsSearchFocused(false), 150);
              }
            }}
          >
            <MangaSearch onSearch={onSearch} />
            <button onClick={toggleSearchOverlay} className="close-search-overlay">✕</button>
            
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
        </div>
      )}
    </>
  );
};

export default Navbar;
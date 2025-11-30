// ... existing code ...
import './MangaSearch.css';

const MangaSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form className="search-bar-container" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Enter a search query..."
        value={query}
        onChange={e => setQuery(e.target.value)}
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
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </form>
  );
};

export default MangaSearch;
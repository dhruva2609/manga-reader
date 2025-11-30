import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MangaList from '../manga/MangaList';

const SearchView = ({ searchResults, loading, onSelectManga }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  return (
    <div className="search-view-container">
      <h2 className="view-title">
        {loading ? `Searching for "${query}"...` : `Search Results for "${query}"`}
      </h2>
      
      {loading && 
        <div className="skeleton" style={{ height: 200, width: '100%' }} />
      }

      {!loading && searchResults.length === 0 && (
        <div className="fav-empty">
          <p>No results found for **"{query}"**.</p>
        </div>
      )}

      {!loading && searchResults.length > 0 && (
        <MangaList mangas={searchResults} onSelect={(manga) => onSelectManga(manga.id)} />
      )}
    </div>
  );
};

export default SearchView;
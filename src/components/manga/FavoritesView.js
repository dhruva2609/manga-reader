import React from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import './FavoritesView.css';

const FavoritesView = ({ onSelectManga }) => {
  const { favorites, removeFavorite } = useFavorites();

  // The FavoritesView is the full-page grid displaying manga covers.
  if (!favorites || favorites.length === 0) {
    return (
      <div className="fav-empty">
        <h2 className="view-title">My Favorites</h2>
        <p>Start reading and click "Add to Favorites" to save your manga here.</p>
      </div>
    );
  }

  return (
    <div className="fav-view-container">
      <h2 className="view-title">My Favorites</h2>
      
      <div className="fav-grid">
        {favorites.map(manga => (
          // IMPORTANT: Pass the manga ID to the routing handler
          <div key={manga.id} className="fav-grid-item" onClick={() => onSelectManga(manga.id)}>
            <div className="fav-cover-wrapper">
              <img 
                src={manga.cover || 'https://via.placeholder.com/150'} 
                alt={manga.title} 
                loading="lazy"
              />
              <button 
                className="fav-delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents navigation when deleting
                  removeFavorite(manga.id);
                }}
              >
                ×
              </button>
            </div>
            <h4 className="fav-item-title">{manga.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesView;
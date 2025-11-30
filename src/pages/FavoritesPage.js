import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import FavoritesList from '../components/manga/FavoritesList';
import './FavoritesPage.css'; 

const FavoritesPage = () => {
  const { favorites } = useFavorites();

  return (
    <div className="favorites-page-container">
      <h2 className="favorites-page-title">My Favorites</h2>
      {favorites.length === 0 ? (
        <div className="favorites-empty-placeholder">
          <p>Your favorite manga will appear here.</p>
          <p className="empty-subtext">You can add a manga to your favorites from its detail page.</p>
        </div>
      ) : (
        <FavoritesList favorites={favorites} />
      )}
    </div>
  );
};

export default FavoritesPage;
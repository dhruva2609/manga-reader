import React from 'react';
import { useFavorites } from '../../context/FavoritesContext'; 
import './HeroSection.css';
import { getMangaTitle, getCoverUrl } from '../../utils';

const HeroSection = ({ manga, onRead }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  if (!manga) return null;

  const coverUrl = getCoverUrl(manga);

  const title = getMangaTitle(manga);
  const desc = manga.attributes.description?.en 
    ? manga.attributes.description.en 
    : "No description available.";

  const isFav = isFavorite(manga.id);

  const handleToggleFavorite = () => {
    // Favorites is functional via Context calls
    isFav ? removeFavorite(manga.id) : addFavorite(manga);
  };

  return (
    <div className="hero-section" style={{ backgroundImage: `url(${coverUrl})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <span className="hero-badge">🔥 Trending #1</span>
          
          <h1 className="fab-title">{title}</h1>
          
          <p className="hero-desc">{desc.slice(0, 200)}...</p>
          <div className="hero-buttons">
            <button 
              className="hero-btn-primary" 
              onClick={() => onRead(manga)}
            >
              Read Now
            </button>
            
            <button 
              className={`hero-btn-secondary ${isFav ? 'active' : ''}`}
              onClick={handleToggleFavorite}
            >
              {isFav ? '✓ Added' : '+ Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
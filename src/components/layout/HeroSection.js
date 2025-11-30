import React from 'react';
import { getMangaTitle } from '../../utils'; 
import { useFavorites } from '../../context/FavoritesContext'; 
import './HeroSection.css';

const HeroSection = ({ manga, onRead }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  if (!manga) return null;

  // Logic to find the cover art relationship
  const cover = manga.relationships.find(r => r.type === 'cover_art');
  // Construct the high-resolution cover URL (Poster Source)
  const coverUrl = cover
    ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.512.jpg`
    : '';

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
              // Functional fix: Navigates to manga details using ID
              onClick={() => onRead(manga.id)}
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
import React from "react";
import { getCoverUrl, getMangaTitle } from '../../utils';
import { Star } from 'lucide-react';
import './MangaCard.css';

const MangaCard = ({ manga, onSelect, displayVariant, progress, maxProgress, rating, genres }) => {
  // Pass the full manga object — getCoverUrl will extract id + fileName internally
  const coverUrl = getCoverUrl(manga);
  const title = getMangaTitle(manga);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(manga);
    }
  };

  // Determine glow class (alternate between cyan and pink for demo purposes)
  // In a real app, you might base this on the manga ID or leave it random.
  const isPink = manga.id ? manga.id.charCodeAt(0) % 2 === 0 : false;
  const glowClass = isPink ? 'glow-pink' : 'glow-cyan';

  return (
    <div 
      className={`manga-card ${displayVariant ? displayVariant + '-variant' : ''} ${glowClass}`} 
      onClick={handleSelect}
    >
      {displayVariant === 'continue-reading' ? (
        <div className="card-image-container full-cover">
          <img
            src={coverUrl || "https://via.placeholder.com/150"}
            alt={title}
            className="card-image"
            onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
          />
          <div className="continue-reading-overlay">
            <div className="manga-card-title">{title}</div>
            <span className="chapter-text">Ch. {progress}/{maxProgress || '?'}</span>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${Math.min(100, (progress / (maxProgress || progress || 1)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="card-image-container">
            <img
              src={coverUrl || "https://via.placeholder.com/150"}
              alt={title}
              className="card-image"
              onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
            />
          </div>
          <div className="manga-card-info">
            <div className="manga-card-title">{title}</div>
            {displayVariant === 'library' && (
              <div className="manga-card-library-info">
                <span className="genres-text">{genres || 'Action • Romance'}</span>
                <div className="library-action-row">
                  {rating ? (
                    <span className="rating"><Star size={12} className="star-icon" fill="currentColor"/> {rating}</span>
                  ) : (
                    <span className="rating-placeholder"></span>
                  )}
                  <button className="read-btn">Read</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MangaCard;
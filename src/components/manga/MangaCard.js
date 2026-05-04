import React from "react";
import { getCoverUrl, getMangaTitle } from '../../utils';
import './MangaCard.css';

const MangaCard = ({ manga, onSelect, displayVariant }) => {
  // Pass the full manga object — getCoverUrl will extract id + fileName internally
  const coverUrl = getCoverUrl(manga);
  const title = getMangaTitle(manga);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(manga);
    }
  };

  return (
    <div className={`manga-card ${displayVariant === 'grid' ? 'grid-variant' : ''} ${displayVariant === 'compact' ? 'compact-variant' : ''}`} onClick={handleSelect}>
      <div className="card-image-container">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="card-image"
            onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }} // Fallback for broken proxy hits
          />
        ) : (
          <img src="https://via.placeholder.com/150" alt={title} className="card-image" />
        )}
      </div>
      <div className="manga-card-title">
        {title}
      </div>
    </div>
  );
};

export default MangaCard;
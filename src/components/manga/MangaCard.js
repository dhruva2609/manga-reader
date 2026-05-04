import React from "react";
import { getCoverUrl, getMangaTitle } from '../../utils';
import './MangaCard.css';

const MangaCard = ({ manga, onSelect, displayVariant }) => {
  // 1. Find the filename inside the relationships array
  const coverFileName = manga.relationships?.find(r => r.type === 'cover_art')?.attributes?.fileName;

  // 2. Pass both required arguments to the helper
  const coverUrl = getCoverUrl(manga.id, coverFileName);

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
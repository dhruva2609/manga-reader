import React from "react";
import { useFavorites } from "../../context/FavoritesContext";
import { useReadingProgress } from "../../context/ReadingProgressContext";
import { getCoverUrl, getMangaTitle } from '../../utils';
import './MangaCard.css';

const MangaCard = ({ manga, onSelect }) => {
  const coverUrl = getCoverUrl(manga);
  const title = getMangaTitle(manga);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(manga);
    }
  };

  return (
    <div className="manga-card" onClick={handleSelect}>
      <div className="card-image-container">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="card-image" />
        ) : (
          <img src="https://via.placeholder.com/150" alt={title} className="card-image" />
        )}
      </div>
      <div className="card-title">
        {title}
      </div>
    </div>
  );
};
export default MangaCard;
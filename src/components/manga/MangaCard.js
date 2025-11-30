import React from "react";
import { useFavorites } from "../../context/FavoritesContext";
import { useReadingProgress } from "../../context/ReadingProgressContext";
import { getMangaTitle } from "../../utils";
import "./MangaCard.css";

const MangaCard = ({ manga, onSelect, coverUrl, displayVariant = 'full' }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { getMangaProgress } = useReadingProgress();

  const progress = getMangaProgress(manga.id);
  
  const title = getMangaTitle(manga) || manga.title;
  
  const desc = manga.attributes?.description?.en
    ? manga.attributes.description.en.slice(0, 80) + "..."
    : "No description.";

  const imageSrc = coverUrl || manga.coverUrl || manga.cover || "https://via.placeholder.com/150";

  const handleFavorite = (e) => {
    e.stopPropagation();
    isFavorite(manga.id) ? removeFavorite(manga.id) : addFavorite(manga);
  };

  if (displayVariant === 'grid') {
    return (
      <div className="manga-card-grid-item" onClick={() => onSelect(manga)}>
        <img src={imageSrc} alt={title} className="manga-card-grid-cover" />
        <div className="manga-card-grid-title">{title}</div>
      </div>
    );
  }

  return (
    <div className="manga-card" onClick={() => onSelect(manga)}>
      <div style={{ position: 'relative' }}>
        <img src={imageSrc} alt={title} />
        {progress && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(0,0,0,0.8)', color: '#fff',
            fontSize: '0.75rem', padding: '3px', textAlign: 'center',
            backdropFilter: 'blur(4px)'
          }}>
            {progress.chapterTitle || `Ch ${progress.chapterId}`}
          </div>
        )}
      </div>
      <div>
        <div className="manga-card-title">{title}</div>
        <div className="manga-card-desc">{desc}</div>
      </div>
      <button
        className={`favorite-btn${isFavorite(manga.id) ? " active" : ""}`}
        onClick={handleFavorite}
      >
        {isFavorite(manga.id) ? "★" : "☆"}
      </button>
    </div>
  );
};

export default MangaCard;
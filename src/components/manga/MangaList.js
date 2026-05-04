import React from 'react';
import { Link } from 'react-router-dom';
import MangaCard from './MangaCard'; // Import MangaCard
import './MangaCard.css';

const MangaList = ({ mangas, onSelect }) => {
  if (!mangas || mangas.length === 0) {
    return <div className="no-results">No manga found.</div>;
  }

  return (
    <div className="manga-list">
      {mangas.map((manga) => (
        <div
          key={manga.id}
          className="manga-card-link"
          onMouseDown={(e) => e.preventDefault()} // Prevent blur so click registers in search dropdown
          onClick={() => onSelect(manga)}
        >
          <MangaCard manga={manga} onSelect={undefined} displayVariant="compact" />
        </div>
      ))}
    </div>
  );
};

export default MangaList;
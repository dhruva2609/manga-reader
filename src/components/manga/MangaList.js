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
        <Link 
          to={`/manga/${manga.id}`} 
          key={manga.id} 
          className="manga-card-link"
          onClick={() => onSelect(manga)}
        >
          <MangaCard manga={manga} />
        </Link>
      ))}
    </div>
  );
};

export default MangaList;
import React from 'react';
import MangaCard from './MangaCard';

// FIX: Centralize the IMAGE_HOST logic using NODE_ENV
const IMAGE_HOST = 
  process.env.NODE_ENV === 'development'
    ? 'https://uploads.mangadex.org' 
    : '/api/mangadex-img'; // <-- Points to the new Serverless Function

const MangaList = ({ mangas, onSelect }) => (
  <div className="manga-list">
    {mangas.map(manga => {
      // Logic to extract cover URL
      const cover = manga.relationships.find(r => r.type === 'cover_art');
      const coverUrl = cover
        ? `${IMAGE_HOST}/covers/${manga.id}/${cover.attributes.fileName}.256.jpg` // <--- Uses IMAGE_HOST
        : 'https://via.placeholder.com/150'; // Fallback image

      return (
        <MangaCard 
          key={manga.id} 
          manga={manga} 
          onSelect={onSelect} 
          coverUrl={coverUrl} 
        />
      );
    })}
  </div>
);

export default MangaList;
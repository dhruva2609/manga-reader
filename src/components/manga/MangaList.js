import React from 'react';
import MangaCard from './MangaCard'; // <--- Import the component

// New constant for the proxied image host path
const IMAGE_HOST = 
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'https://uploads.mangadex.org' 
    : '/api/mangadex-img'; // Use the new Vercel proxy path

const MangaList = ({ mangas, onSelect }) => (
  <div className="manga-list">
    {mangas.map(manga => {
      // Logic to extract cover URL
      const cover = manga.relationships.find(r => r.type === 'cover_art');
      const coverUrl = cover
        ? `${IMAGE_HOST}/covers/${manga.id}/${cover.attributes.fileName}.256.jpg` // <--- Use IMAGE_HOST here
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
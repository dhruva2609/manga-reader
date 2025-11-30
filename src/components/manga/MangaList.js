import React from 'react';
import MangaCard from './MangaCard'; // <--- Import the component

const MangaList = ({ mangas, onSelect }) => (
  <div className="manga-list">
    {mangas.map(manga => {
      // Logic to extract cover URL
      const cover = manga.relationships.find(r => r.type === 'cover_art');
      const coverUrl = cover
        ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.256.jpg`
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
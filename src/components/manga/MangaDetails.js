import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMangaDetails } from '../../api/mangadex';
import { useFavorites } from '../../context/FavoritesContext';
import { getMangaTitle } from '../../utils';

const MangaDetails = () => {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  const [manga, setManga] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const data = await getMangaDetails(mangaId);
      // Data from API often needs processing to get the title/cover easily
      if (data) {
        // Hydrate the object with calculated title for consistency
        data.title = getMangaTitle(data); 
        setManga(data);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [mangaId]);

  if (loading) return <div className="loader">Loading Manga Details...</div>;
  if (!manga) return <h1>Manga Not Found.</h1>;

  const handleShowChapters = () => {
    // Navigate to the chapter list route for this specific manga
    navigate(`/manga/${mangaId}/chapters`);
  };

  const handleToggleFavorite = () => {
    isFavorite(manga.id) ? removeFavorite(manga.id) : addFavorite(manga);
  };
  
  const isFav = isFavorite(manga.id);
  const desc = manga.attributes.description?.en?.slice(0, 500) || 'No description available.';

  return (
    <div className="manga-details">
      <h2>{manga.title}</h2>
      
      {/* Action Buttons */}
      <div className="hero-buttons" style={{marginBottom: '1.5rem'}}>
        <button 
          className="hero-btn-primary" 
          onClick={handleShowChapters}
        >
          View Chapters
        </button>
        <button 
          className={`hero-btn-secondary ${isFav ? 'active' : ''}`}
          onClick={handleToggleFavorite}
        >
          {isFav ? '✓ Added to Favorites' : '+ Add to Favorites'}
        </button>
      </div>

      <p>{desc}</p>
      {desc.length === 500 && <p>... read more</p>}

      {/* Placeholder for cover art if needed in this view */}
      {/* Note: The cover image is usually extracted and displayed separately or in a layout */}
    </div>
  );
};

export default MangaDetails;
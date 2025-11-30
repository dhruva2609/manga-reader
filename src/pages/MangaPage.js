import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMangaDetails, getChapters } from '../api/mangadex';
import { useFavorites } from '../context/FavoritesContext';
import { getMangaTitle } from '../utils';
import ChapterList from '../components/reader/ChapterList';

const MangaPage = () => {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChapters, setShowChapters] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const [mangaData, chaptersData] = await Promise.all([
        getMangaDetails(mangaId),
        getChapters(mangaId)
      ]);

      if (mangaData) {
        mangaData.title = getMangaTitle(mangaData);
        setManga(mangaData);
      }
      if (chaptersData) {
        setChapters(chaptersData);
      }
      setLoading(false);
    };
    fetchDetails();
  }, [mangaId]);

  if (loading) return <div className="loader">Loading Manga Details...</div>;
  if (!manga) return <h1>Manga Not Found.</h1>;

  const handleToggleFavorite = () => {
    isFavorite(manga.id) ? removeFavorite(manga.id) : addFavorite(manga);
  };

  const isFav = isFavorite(manga.id);
  const desc = manga.attributes.description?.en?.slice(0, 500) || 'No description available.';

  return (
    <div className="manga-details">
      <h2>{manga.title}</h2>

      <div className="hero-buttons" style={{marginBottom: '1.5rem'}}>
        <button
          className="hero-btn-primary"
          onClick={() => setShowChapters(!showChapters)}
        >
          {showChapters ? 'Hide Chapters' : 'Show Chapters'}
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

      {showChapters && <ChapterList chapters={chapters} />}
    </div>
  );
};

export default MangaPage;
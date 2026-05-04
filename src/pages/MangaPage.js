import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMangaDetails, getChapters } from '../api/mangadex';
import { useFavorites } from '../context/FavoritesContext';
import { getMangaTitle, getCoverUrl } from '../utils';
import ChapterList from '../components/reader/ChapterList';

const MangaPage = () => {
  const { mangaId } = useParams();
  //const navigate = useNavigate();
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
  const coverUrl = getCoverUrl(manga);

  return (
    <div className="manga-details animate-fade-in">
      <div className="manga-header">
        {coverUrl && (
          <img
            src={coverUrl}
            alt={manga.title}
            className="manga-cover animate-scale-in"
          />
        )}
        <div className="manga-info animate-slide-up delay-100">
          <h2>{manga.title}</h2>
          {manga.attributes.author && manga.attributes.author.length > 0 && (
            <p className="manga-author">By {manga.attributes.author.map(a => a.name).join(', ')}</p>
          )}
          <div className="hero-buttons">
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
              {isFav ? '✓ Added' : '+ Add to Favorites'}
            </button>
          </div>
        </div>
      </div>

      <div className="manga-description">
        <h3>Synopsys</h3>
        <p>{desc}</p>
        {desc.length === 500 && <p>... read more</p>}
      </div>

      {showChapters && <ChapterList chapters={chapters} />}
    </div>
  );
};

export default MangaPage;
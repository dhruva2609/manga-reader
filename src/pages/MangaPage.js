import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMangaDetails, getChapters } from '../api/mangadex';
import { useFavorites } from '../context/FavoritesContext';
import { useReadingProgress } from '../context/ReadingProgressContext';
import { getMangaTitle, getCoverUrl } from '../utils';
import ChapterList from '../components/reader/ChapterList';
import { Heart, ChevronDown, Check } from 'lucide-react';

const MangaPage = () => {
  const { mangaId } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite, getFavoriteFolder, updateFavoriteFolder } = useFavorites();
  const { getMangaProgress } = useReadingProgress();

  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChapters, setShowChapters] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      console.log('MangaPage: Fetching details for ID:', mangaId);
      setLoading(true);
      try {
        const [mangaData, chaptersData] = await Promise.all([
          getMangaDetails(mangaId),
          getChapters(mangaId)
        ]);

        console.log('MangaPage: Manga Data:', mangaData ? 'Found' : 'Null');
        console.log('MangaPage: Chapters Count:', chaptersData ? chaptersData.length : 0);

        if (mangaData) {
          mangaData.title = getMangaTitle(mangaData);
          setManga(mangaData);
        }
        if (chaptersData) {
          setChapters(chaptersData);
        }
      } catch (err) {
        console.error('MangaPage: Error in fetchDetails:', err);
      } finally {
        setLoading(false);
      }
    };

    if (mangaId) {
      fetchDetails();
    }
  }, [mangaId]);

  if (loading) return <div className="loader">Loading Manga Details...</div>;
  if (!manga) return (
    <div className="manga-not-found">
      <h1>Manga Not Found.</h1>
      <p>ID requested: {mangaId}</p>
    </div>
  );


  const isFav = isFavorite(manga.id);
  const desc = manga.attributes.description?.en?.slice(0, 500) || 'No description available.';
  const coverUrl = getCoverUrl(manga);

  const activeFolder = getFavoriteFolder(manga.id) || "Currently Reading";

  const getFolderIcon = (folder) => {
    switch (folder) {
      case "Currently Reading": return "📖";
      case "Plan to Read": return "📅";
      case "Completed": return "✅";
      default: return "📁";
    }
  };

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
            {showFolderDropdown && isFav && (
              <div 
                className="dropdown-overlay" 
                onClick={() => setShowFolderDropdown(false)} 
              />
            )}
            <div className="fav-dropdown-wrapper">
              <button
                className={`hero-btn-secondary fav-trigger-btn ${isFav ? 'active' : ''}`}
                onClick={() => {
                  if (!isFav) {
                    addFavorite(manga);
                    setShowFolderDropdown(true);
                  } else {
                    setShowFolderDropdown(!showFolderDropdown);
                  }
                }}
              >
                {isFav ? (
                  <>
                    <Heart size={16} fill="var(--accent2)" color="var(--accent2)" className="fav-heart-icon" />
                    <span>{getFolderIcon(activeFolder)} {activeFolder}</span>
                    <ChevronDown size={14} className={`fav-arrow-icon ${showFolderDropdown ? 'rotated' : ''}`} />
                  </>
                ) : (
                  <>
                    <Heart size={16} className="fav-heart-icon" />
                    <span>Add to Favorites</span>
                  </>
                )}
              </button>

              {showFolderDropdown && isFav && (
                <div className="fav-folder-menu glass-panel animate-scale-in">
                  <div className="menu-header">Organize Library</div>
                  
                  <button 
                    className={`menu-item ${activeFolder === 'Currently Reading' ? 'selected' : ''}`}
                    onClick={() => {
                      updateFavoriteFolder(manga.id, 'Currently Reading');
                      setShowFolderDropdown(false);
                    }}
                  >
                    <span className="item-emoji">📖</span>
                    <span className="item-label">Currently Reading</span>
                    {activeFolder === 'Currently Reading' && <Check size={14} className="check-icon" />}
                  </button>

                  <button 
                    className={`menu-item ${activeFolder === 'Plan to Read' ? 'selected' : ''}`}
                    onClick={() => {
                      updateFavoriteFolder(manga.id, 'Plan to Read');
                      setShowFolderDropdown(false);
                    }}
                  >
                    <span className="item-emoji">📅</span>
                    <span className="item-label">Plan to Read</span>
                    {activeFolder === 'Plan to Read' && <Check size={14} className="check-icon" />}
                  </button>

                  <button 
                    className={`menu-item ${activeFolder === 'Completed' ? 'selected' : ''}`}
                    onClick={() => {
                      updateFavoriteFolder(manga.id, 'Completed');
                      setShowFolderDropdown(false);
                    }}
                  >
                    <span className="item-emoji">✅</span>
                    <span className="item-label">Completed</span>
                    {activeFolder === 'Completed' && <Check size={14} className="check-icon" />}
                  </button>

                  <div className="menu-divider" />

                  <button 
                    className="menu-item remove-item"
                    onClick={() => {
                      removeFavorite(manga.id);
                      setShowFolderDropdown(false);
                    }}
                  >
                    <span className="item-emoji">💔</span>
                    <span className="item-label">Remove Favorite</span>
                  </button>
                </div>
              )}
            </div>
            {getMangaProgress(manga.id) && (
              <button
                className="hero-btn-primary resume-manga-btn"
                onClick={() => navigate(`/read/${getMangaProgress(manga.id).lastReadChapterId}`)}
                title={`Resume: Ch. ${getMangaProgress(manga.id).lastReadChapterTitle || "Active"} (Page ${getMangaProgress(manga.id).lastReadPage + 1})`}
              >
                <span className="btn-emoji">🔖</span>
                <span className="btn-text-truncate">
                  Resume: Ch. {getMangaProgress(manga.id).lastReadChapterTitle || "Active"} (Page {getMangaProgress(manga.id).lastReadPage + 1})
                </span>
              </button>
            )}
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
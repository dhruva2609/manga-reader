import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/layout/HeroSection';
import MangaCard from '../components/manga/MangaCard';
import { getPopularManga, getTrendingManga, getRecentlyAddedManga, getMangaDetails } from '../api/mangadex';
import { useFavorites } from '../context/FavoritesContext';
import { useReadingProgress } from '../context/ReadingProgressContext';
import {
  Heart,
  History,
  Dices,
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import './Home.css';

const HomePage = () => {
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Advanced features state
  const [showRouletteModal, setShowRouletteModal] = useState(false);
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState(null);
  const [rouletteIndex, setRouletteIndex] = useState(0);

  const { favorites } = useFavorites();
  const { getReadingHistory, getLastRead } = useReadingProgress();
  const historyList = getReadingHistory();
  const lastRead = getLastRead();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [popularData, trendData, recentData, onePieceData] = await Promise.all([
          getPopularManga(),
          getTrendingManga(),
          getRecentlyAddedManga(),
          getMangaDetails('a2c1d849-af05-4bbc-b2a7-866ebb10331f') // One Piece Colored ID
        ]);

        let combinedTrending = trendData || [];
        if (onePieceData) {
          // Remove if it already exists to prevent duplicate keys
          combinedTrending = combinedTrending.filter(m => m.id !== onePieceData.id);
          // Prepend One Piece Colored
          combinedTrending = [onePieceData, ...combinedTrending];
        }

        setPopular(popularData || []);
        setTrending(combinedTrending);
        setRecent(recentData || []);
      } catch (error) {
        console.error("Home page API fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSelect = (manga) => {
    navigate(`/manga/${manga.id}`);
  };

  // Dashboard Stats Calculations
  const favCount = favorites.length;
  const histCount = historyList.length;

  // Spin the Manga Roulette
  const spinRoulette = () => {
    if (rouletteSpinning) return;

    // Aggregate all loaded mangas to choose from
    const pool = [...popular, ...trending, ...recent];
    if (pool.length === 0) return;

    setRouletteSpinning(true);
    setRouletteResult(null);

    // Fast-spinning cover animation
    let counter = 0;
    const maxSpins = 18;
    const interval = setInterval(() => {
      const tempIndex = Math.floor(Math.random() * pool.length);
      setRouletteIndex(tempIndex);
      counter++;

      if (counter >= maxSpins) {
        clearInterval(interval);
        // Final landing
        const finalManga = pool[Math.floor(Math.random() * pool.length)];
        setRouletteResult(finalManga);
        setRouletteSpinning(false);
      }
    }, 110);
  };

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  const heroManga = trending.length > 0 ? trending[0] : null;
  const poolForRoulette = [...popular, ...trending, ...recent];

  return (
    <div className="home-container">

      {heroManga && <HeroSection manga={heroManga} onRead={onSelect} />}

      {/* === Dashboard Stats === */}
      <div className="home-dashboard-container animate-fade-in">
        <div className="home-welcome-header">
          <h2>Welcome back, Reader! <span className="hand-wave">👋</span></h2>
          <p>Explore your premium ad-free reader engine synced live with global CDN servers.</p>
          {lastRead && (
            <button
              className="resume-strip-pill animate-slide-up"
              onClick={() => navigate(`/read/${lastRead.lastReadChapterId}`)}
            >
              <span className="resume-label-tag">🔖 RESUME BOOKMARK</span>
              <span className="resume-divider">|</span>
              <span className="resume-btn-text">
                Continue <strong className="resume-title-truncate" title={lastRead.title || "Manga"}>{lastRead.title || "Manga"}</strong> · Ch. {lastRead.lastReadChapterTitle ? String(lastRead.lastReadChapterTitle).replace(/chapter/i, '').trim() : "Active"} (P. {lastRead.lastReadPage + 1}) →
              </span>
            </button>
          )}
        </div>

        <div className="home-stats-grid">
          <div className="stat-card glass-panel" onClick={() => navigate('/favorites')}>
            <div className="stat-icon-wrapper heart-glow">
              <Heart className="stat-icon text-pink" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{favCount}</span>
              <span className="stat-label">Favorites</span>
            </div>
            <div className="stat-hover-hint">View Library →</div>
          </div>

          <div className="stat-card glass-panel" onClick={() => navigate('/history')}>
            <div className="stat-icon-wrapper history-glow">
              <History className="stat-icon text-purple" />
            </div>
            <div className="stat-info">
              <span className="stat-number">{histCount}</span>
              <span className="stat-label">Reading History</span>
            </div>
            <div className="stat-hover-hint">Resume Reading →</div>
          </div>
        </div>
      </div>

      {/* === Manga Roulette Quick Discover Widget === */}
      <div className="roulette-box-panel glass-panel home-section">
        <div className="roulette-left-desc">
          <div className="roulette-tag">
            <Dices size={14} />
            <span>Interactive Widget</span>
          </div>
          <h3>Otaku Manga Roulette</h3>
          <p>Don't know what to read next? Let the roulette decide! We'll search and spin through trending covers to deliver a customized recommendation.</p>
          <button className="roulette-trigger-btn" onClick={() => { setShowRouletteModal(true); spinRoulette(); }}>
            <Sparkles size={16} />
            <span>Spin the Roulette</span>
          </button>
        </div>
      </div>



      {/* Main categories */}
      {trending.length > 0 && (
        <div className="home-section custom-dashboard-section" key="trending">
          <h3><span role="img" aria-label="fire">🔥</span> Trending Now</h3>
          <div className="custom-horizontal-scroll">
            {trending.map((manga) => (
              <div key={manga.id} className="custom-scroll-item" onClick={() => onSelect(manga)}>
                <MangaCard 
                  manga={manga} 
                  onSelect={onSelect} 
                  displayVariant="library"
                  rating={manga.attributes?.rating}
                  genres={manga.attributes?.tags?.filter(t => t.attributes?.group === 'genre').map(t => t.attributes?.name?.en).slice(0, 2).join(' • ')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {popular.length > 0 && (
        <div className="home-section custom-dashboard-section" key="popular">
          <h3><span role="img" aria-label="crown">👑</span> Most Popular</h3>
          <div className="custom-horizontal-scroll">
            {popular.map((manga) => (
              <div key={manga.id} className="custom-scroll-item" onClick={() => onSelect(manga)}>
                <MangaCard 
                  manga={manga} 
                  onSelect={onSelect} 
                  displayVariant="library"
                  rating={manga.attributes?.rating}
                  genres={manga.attributes?.tags?.filter(t => t.attributes?.group === 'genre').map(t => t.attributes?.name?.en).slice(0, 2).join(' • ')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div className="home-section custom-dashboard-section" key="recent">
          <h3><span role="img" aria-label="sparkles">✨</span> Fresh Picks</h3>
          <div className="custom-horizontal-scroll">
            {recent.map((manga) => (
              <div key={manga.id} className="custom-scroll-item" onClick={() => onSelect(manga)}>
                <MangaCard 
                  manga={manga} 
                  onSelect={onSelect} 
                  displayVariant="library"
                  rating={manga.attributes?.rating}
                  genres={manga.attributes?.tags?.filter(t => t.attributes?.group === 'genre').map(t => t.attributes?.name?.en).slice(0, 2).join(' • ')}
                />
              </div>
            ))}
          </div>
        </div>
      )}      {/* === ROULETTE SPINNER MODAL === */}
      {showRouletteModal && (
        <div className="app-modal-overlay" onClick={() => setShowRouletteModal(false)}>
          <div className="app-modal-card roulette-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="app-modal-header">
              <div className="header-title-wrapper">
                <Dices className="modal-header-icon text-purple animate-spin-once" />
                <h3>Manga Roulette Discovery</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowRouletteModal(false)}>&times;</button>
            </div>

            <div className="app-modal-body roulette-modal-body">
              {rouletteSpinning ? (
                <div className="roulette-spin-container">
                  <div className="spinning-cover-wrapper">
                    {poolForRoulette[rouletteIndex] && (
                      <div className="spinning-cover-glow">
                        <img
                          src={`https://uploads.mangadex.org/covers/${poolForRoulette[rouletteIndex].id}/${poolForRoulette[rouletteIndex].relationships?.find(r => r.type === 'cover_art')?.attributes?.fileName}`}
                          alt="Spinning cover"
                          className="spinning-img"
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/180x260/256c8064/ffffff?text=Manga';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="roulette-loading-bar">
                    <div className="roulette-loading-fill" />
                  </div>
                  <p className="spin-status-msg">Spinning through local archives...</p>
                </div>
              ) : rouletteResult ? (
                <div className="roulette-result-showcase fade-in">
                  <div className="result-layout">
                    <img
                      src={`https://uploads.mangadex.org/covers/${rouletteResult.id}/${rouletteResult.relationships?.find(r => r.type === 'cover_art')?.attributes?.fileName}`}
                      alt={rouletteResult.attributes.title.en}
                      className="result-cover"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/180x260/256c8064/ffffff?text=Manga';
                      }}
                    />
                    <div className="result-info">
                      <span className="match-badge">🎉 Perfect Match Discovered!</span>
                      <h4>{rouletteResult.attributes.title.en || 'Manga Title'}</h4>
                      <p className="result-desc">
                        {rouletteResult.attributes.description?.en?.slice(0, 160) || 'No description available for this title.'}...
                      </p>
                      <div className="result-tags">
                        {rouletteResult.attributes.tags?.slice(0, 3).map(tag => (
                          <span key={tag.id} className="mini-tag">{tag.attributes.name.en}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="roulette-action-row">
                    <button className="spin-again-btn" onClick={spinRoulette}>
                      <RefreshCw size={14} />
                      <span>Spin Again</span>
                    </button>
                    <button className="read-now-btn" onClick={() => { setShowRouletteModal(false); onSelect(rouletteResult); }}>
                      <span>Start Reading</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="roulette-error-box">
                  <p>Unable to spin the wheel. Try again later.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/layout/HeroSection';
import MangaCard from '../components/manga/MangaCard';
import { getPopularManga, getTrendingManga, getRecentlyAddedManga } from '../api/mangadex';
import './Home.css';
import { getCoverUrl } from '../utils'; // <-- Correct Import

// CORRECT: This function uses the proxy logic from getCoverUrl
const getCover = (manga) => {
    const cover = manga.relationships.find(r => r.type === 'cover_art');
    const fileName = cover?.attributes?.fileName;
    return fileName
      ? getCoverUrl(manga.id, fileName, '.256.jpg')
      : null;
  };
  
const HomePage = () => {
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [popularData, trendData, recentData] = await Promise.all([
          getPopularManga(),
          getTrendingManga(),
          getRecentlyAddedManga()
        ]);
        setPopular(popularData || []); 
        setTrending(trendData || []); 
        setRecent(recentData || []);
      } catch (error) {
        console.error("Home page API fetch failed:", error);
        setPopular([]);
        setTrending([]);
        setRecent([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSelectManga = (manga) => {
    navigate(`/manga/${manga.id}`);
  };

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  // !!! REMOVED REDUNDANT, HARDCODED getCover FUNCTION HERE !!!

  const renderMangaSection = (title, data) => (
    <div className="home-section" key={title}>
        <>
          <h3>{title}</h3>
          <div className="horizontal-scroll">
            {data.map(manga => (
              <div key={manga.id} className="scroll-item">
                <MangaCard
                  manga={manga}
                  onSelect={onSelectManga}
                  coverUrl={getCover(manga)}
                />
              </div>
            ))}
          </div>
        </>
    </div>
  );

  const safeTrending = trending || []; 
  
  const heroManga = safeTrending.length > 0 ? [safeTrending[0]] : [];
  const trendingScroll = safeTrending.slice(1);

  return (
    <div className="home-container">
      
      {heroManga.length > 0 && <HeroSection manga={heroManga[0]} onRead={onSelectManga} />}
      
      {trendingScroll.length > 0 && renderMangaSection(<><span>🔥</span> Trending Now</>, trendingScroll)}

      {popular.length > 0 && renderMangaSection(<><span>👑</span> Most Popular</>, popular)}

      {recent.length > 0 && renderMangaSection(<><span>✨</span> Fresh Picks</>, recent)}
    </div>
  );
};

export default HomePage;
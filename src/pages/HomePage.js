import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/layout/HeroSection';
import MangaCard from '../components/manga/MangaCard';
import { getPopularManga, getTrendingManga, getRecentlyAddedManga } from '../api/mangadex';
import './Home.css';

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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSelect = (manga) => {
    navigate(`/manga/${manga.id}`);
  };

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  const renderMangaSection = (title, data) => (
    <div className="home-section" key={title}>
        <h3>{title}</h3>
        <div className="horizontal-scroll">
          {data.map(manga => (
            <div key={manga.id} className="scroll-item" onClick={() => onSelect(manga)}>
              <MangaCard manga={manga} onSelect={onSelect} />
            </div>
          ))}
        </div>
    </div>
  );

  const heroManga = trending.length > 0 ? trending[0] : null;

  return (
    <div className="home-container">
      
      {heroManga && <HeroSection manga={heroManga} onRead={onSelect} />}
      
      {trending.length > 1 && renderMangaSection(<><span>🔥</span> Trending Now</>, trending.slice(1))}

      {popular.length > 0 && renderMangaSection(<><span>👑</span> Most Popular</>, popular)}

      {recent.length > 0 && renderMangaSection(<><span>✨</span> Fresh Picks</>, recent)}
    </div>
  );
};

export default HomePage;
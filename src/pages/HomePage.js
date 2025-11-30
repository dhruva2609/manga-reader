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
      const [popularData, trendData, recentData] = await Promise.all([
        getPopularManga(),
        getTrendingManga(),
        getRecentlyAddedManga()
      ]);
      setPopular(popularData);
      setTrending(trendData);
      setRecent(recentData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const onSelectManga = (manga) => {
    navigate(`/manga/${manga.id}`);
  };

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  const getCover = (manga) => {
    const cover = manga.relationships.find(r => r.type === 'cover_art');
    return cover
      ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.256.jpg`
      : null;
  };

  const renderMangaSection = (title, data) => (
    <div className="home-section" key={title}>
        <>
          <h3>{title}</h3>
          <div className="horizontal-scroll">
            {data.map(manga => (
              <div key={manga.id} className="scroll-item">
                <MangaCard
                  manga={manga}
                  onSelect={() => onSelectManga(manga)}
                  coverUrl={getCover(manga)}
                />
              </div>
            ))}
          </div>
        </>
    </div>
  );

  const heroManga = trending.length > 0 ? [trending[0]] : [];
  const trendingScroll = trending.slice(1);

  return (
    <div className="home-container">
      
      {heroManga.length > 0 && <HeroSection manga={heroManga[0]} onRead={() => onSelectManga(heroManga[0])} />}
      
      {trendingScroll.length > 0 && renderMangaSection(<><span>🔥</span> Trending Now</>, trendingScroll)}

      {popular.length > 0 && renderMangaSection(<><span>👑</span> Most Popular</>, popular)}

      {recent.length > 0 && renderMangaSection(<><span>✨</span> Fresh Picks</>, recent)}
    </div>
  );
};

export default HomePage;
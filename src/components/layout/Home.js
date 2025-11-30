import React, { useEffect, useState } from 'react';
import HeroSection from './HeroSection'; // <-- Re-imported HeroSection
import MangaCard from '../manga/MangaCard';
import { getPopularManga, getTrendingManga, getRecentlyAddedManga } from '../../api/mangadex';
import './Home.css';

const Home = ({ onSelectManga }) => {
  const [popular, setPopular] = useState([]); 
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch all three lists concurrently
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

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  // Logic to resolve cover for lists
  const getCover = (manga) => {
    const cover = manga.relationships.find(r => r.type === 'cover_art');
    // NOTE: MangaDex URL format requires the .256.jpg suffix for small covers
    return cover 
      ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.256.jpg` 
      : null;
  };

  const renderMangaSection = (title, data, isHero = false) => (
    <div className="home-section" key={title}>
      {isHero ? (
        // Render the HeroSection for the top trending item
        <HeroSection manga={data[0]} onRead={onSelectManga} />
      ) : (
        // Render horizontal scroll list
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
      )}
    </div>
  );

  // Separate trending list into Hero (first item) and Scroll (rest)
  const heroManga = trending.length > 0 ? [trending[0]] : [];
  const trendingScroll = trending.slice(1);

  return (
    <div className="home-container">
      
      {/* 1. Hero Section (using the #1 trending item) */}
      {heroManga.length > 0 && <HeroSection manga={heroManga[0]} onRead={onSelectManga} />}
      
      {/* 2. Section: Trending Now (The rest of the trending list) */}
      {trendingScroll.length > 0 && renderMangaSection("🔥 Trending Now", trendingScroll)}

      {/* 3. Section: Most Popular */}
      {popular.length > 0 && renderMangaSection("👑 Most Popular", popular)}

      {/* 4. Section: Fresh Picks */}
      {recent.length > 0 && renderMangaSection("✨ Fresh Picks", recent)}
    </div>
  );
};

export default Home;
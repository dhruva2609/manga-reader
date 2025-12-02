import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import MangaCard from '../manga/MangaCard';
import { getPopularManga, getTrendingManga, getRecentlyAddedManga } from '../../api/mangadex';
import { getCoverUrl } from '../../utils'; // <-- KEEP THIS IMPORT
import './Home.css';

const Home = ({ onSelectManga }) => { // FIX: Changed prop name from onSelect to onSelectManga
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  // FIX: Removed unnecessary useNavigate, as onSelectManga is a prop (if using HomePage.js) 
  // or onSelect (if using Home.js, which is likely the final version)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [popularData, trendData, recentData] = await Promise.all([
          getPopularManga(), 
          getTrendingManga(),
          getRecentlyAddedManga()
        ]);
        setPopular(popularData);
        setTrending(trendData);
        setRecent(recentData);
      } catch (error) {
        console.error("Home page API fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  // FIX: Removed the redundant getCover function. MangaCard handles cover URL generation.
  // const getCover = (manga) => {
  //   const cover = manga.relationships.find(r => r.type === 'cover_art');
  //   const fileName = cover?.attributes?.fileName;
  //   return fileName
  //     ? getCoverUrl(manga.id, fileName, '.256.jpg') 
  //     : null;
  // };

  const renderMangaSection = (title, data) => (
    <div className="home-section" key={title}>
      <h3>{title}</h3>
      <div className="horizontal-scroll">
        {data.map(manga => (
          <div key={manga.id} className="scroll-item">
            <MangaCard 
              manga={manga} 
              onSelect={onSelectManga} 
              // FIX: Removed redundant coverUrl prop. MangaCard will now use the correct getCoverUrl internally.
            />
          </div>
        ))}
      </div>
    </div>
  );

  // Separate trending list into Hero (first item) and Scroll (rest)
  const heroManga = trending.length > 0 ? trending[0] : null;
  const trendingScroll = trending.slice(1);

  return (
    <div className="home-container">
      
      {/* 1. Hero Section (using the #1 trending item) */}
      {heroManga && <HeroSection manga={heroManga} onRead={onSelectManga} />}
      
      {/* 2. Section: Trending Now (The rest of the trending list) */}
      {trendingScroll.length > 0 && renderMangaSection(<><span>🔥</span> Trending Now</>, trendingScroll)}

      {/* 3. Section: Most Popular */}
      {popular.length > 0 && renderMangaSection(<><span>👑</span> Most Popular</>, popular)}

      {/* 4. Section: Fresh Picks */}
      {recent.length > 0 && renderMangaSection(<><span>✨</span> Fresh Picks</>, recent)}
    </div>
  );
};

export default Home;
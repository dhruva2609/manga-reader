// dhruva2609/manga-reader/manga-reader-3f9a413352cfb264eb5d8cb750ebb72b19ba292e/src/pages/HistoryPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReadingProgress } from '../context/ReadingProgressContext';

// FIX: Change import to HistoryList (which is where the actual list lives)
import HistoryList from '../components/manga/HistoryList'; 

const HistoryPage = () => {
  // FIX: Use the correct method, getReadingHistory
  const { getReadingHistory } = useReadingProgress();
  const history = getReadingHistory(); // This array now contains objects with the manga inside.
  const navigate = useNavigate();

  const handleMangaClick = (manga) => {
    navigate(`/manga/${manga.id}`);
  };

  return (
    <div className="history-page-container">
      <h2 className="history-page-title">Reading History</h2>
      {/* Pass the full history array */}
      <HistoryList history={history} onMangaClick={handleMangaClick} />
    </div>
  );
};

export default HistoryPage;
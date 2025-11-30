import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReadingProgress } from '../context/ReadingProgressContext';
import HistoryList from '../components/manga/HistoryList';
import './HistoryPage.css';

const HistoryPage = () => {
  const { getAllProgress } = useReadingProgress();
  const history = getAllProgress().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const navigate = useNavigate();

  const handleMangaClick = (manga) => {
    navigate(`/manga/${manga.id}`);
  };

  return (
    <div className="history-page-container">
      <h2 className="history-page-title">Reading History</h2>
      <HistoryList history={history} onMangaClick={handleMangaClick} />
    </div>
  );
};

export default HistoryPage;
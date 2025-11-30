import React from 'react';
import { useReadingProgress } from '../../context/ReadingProgressContext';
import HistoryList from '../manga/HistoryList'; // Assumes HistoryList is built

const HistoryView = ({ onSelectManga }) => {
  const { getAllProgress } = useReadingProgress();
  const history = getAllProgress().sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="history-view-container">
      <h2 className="view-title">Reading History</h2>
      {history.length === 0 ? (
        <div className="fav-empty">
          <p>You haven't read anything yet!</p>
        </div>
      ) : (
        <HistoryList history={history} onSelectManga={onSelectManga} />
      )}
    </div>
  );
};

export default HistoryView;
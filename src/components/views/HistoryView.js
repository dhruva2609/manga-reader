import React from 'react';
import { useReadingProgress } from '../../context/ReadingProgressContext';
import HistoryList from '../manga/HistoryList'; // Assumes HistoryList is built

const HistoryView = ({ onSelectManga }) => {
  // FIX: Use the exported function name getReadingHistory()
  const { getReadingHistory } = useReadingProgress();
  // FIX: getReadingHistory now returns the sorted array, so remove redundant sorting logic.
  const history = getReadingHistory();

  return (
    <div className="history-view-container">
      <h2 className="view-title">Reading History</h2>
      {history.length === 0 ? (
        <div className="fav-empty">
          <p>You haven't read anything yet!</p>
        </div>
      ) : (
        <HistoryList history={history} onMangaClick={onSelectManga} />
      )}
    </div>
  );
};

export default HistoryView;
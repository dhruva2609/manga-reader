import React from 'react';
import MangaCard from './MangaCard';
import './HistoryList.css';

const HistoryList = ({ history, onMangaClick }) => {
  if (!history || history.length === 0) {
    return (
      <div className="history-empty-placeholder">
        <p>Your reading history is empty.</p>
        <p>Start reading to see your history here!</p>
      </div>
    );
  }

  return (
    <div className="history-grid-container">
      <div className="history-grid">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="history-grid-item" 
            onClick={() => onMangaClick(item)} 
          >
            <MangaCard
              manga={item} 
              onSelect={() => {}} 
              displayVariant="history"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
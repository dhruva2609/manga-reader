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
    <div className="history-list">
      {history.map((item) => (
        <div key={item.manga.id} className="history-list-item">
          <MangaCard
            manga={item.manga}
            onSelect={() => onMangaClick(item.manga.id)}
            coverUrl={item.manga.coverUrl}
            displayVariant="list"
          />
          <div className="history-item-details">
            <p className="history-item-title">{item.manga.title}</p>
            {item.chapterTitle && (
              <p className="history-item-chapter">
                Last read: {item.chapterTitle}
              </p>
            )}
            {item.updatedAt && (
              <p className="history-item-last-read">
                {new Date(item.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
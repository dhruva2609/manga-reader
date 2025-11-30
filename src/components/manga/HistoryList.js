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
        // The entire list item is now clickable
        <div 
          key={item.manga.id} 
          className="history-list-item" 
          onClick={() => onMangaClick(item.manga)}
        >
          {/* MangaCard is used to display the cover image with chapter overlay */}
          <MangaCard
            manga={item.manga}
            onSelect={() => {}} // Click handled by parent div
            coverUrl={item.manga.coverUrl}
            displayVariant="list"
          />
          {/* Display details next to the image */}
          <div className="history-item-details">
            <p className="history-item-title">{item.manga.title}</p>
            {item.chapterTitle && (
              <p className="history-item-chapter">
                Last read: {item.chapterTitle}
              </p>
            )}
          </div>
          {/* Display timestamp pushed to the right */}
          {item.updatedAt && (
            <p className="history-item-last-read">
              {new Date(item.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
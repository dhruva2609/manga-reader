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
          key={item.id} 
          className="history-list-item" 
          // Note: item contains the full manga object and progress details (lastReadChapterTitle, timestamp)
          onClick={() => onMangaClick(item)} 
        >
          {/* MangaCard is used to display the cover image. It receives the full manga object (item). */}
          <MangaCard
            manga={item} 
            onSelect={() => {}} 
            displayVariant="list"
          />
          {/* Display details next to the image */}
          <div className="history-item-details">
            <p className="history-item-title">{item.title}</p> 
            {item.lastReadChapterTitle && (
              <p className="history-item-chapter">
                Last read: {item.lastReadChapterTitle}
              </p>
            )}
          </div>
          {/* Display timestamp pushed to the right, now correctly repositioned by CSS */}
          {item.timestamp && (
            <p className="history-item-last-read">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
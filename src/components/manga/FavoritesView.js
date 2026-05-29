import React, { useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { FolderHeart, ChevronDown } from 'lucide-react';
import './FavoritesView.css';

const FavoritesView = ({ onSelectManga }) => {
  const { favorites, removeFavorite } = useFavorites();
  const [activeFolder, setActiveFolder] = useState('Currently Reading');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const folders = ['Currently Reading', 'Plan to Read', 'Completed'];

  // Filter favorites based on the active folder
  const filteredFavorites = favorites.filter(
    (fav) => (fav.folder || 'Currently Reading') === activeFolder
  );

  // The FavoritesView is the full-page grid displaying manga covers.
  if (!favorites || favorites.length === 0) {
    return (
      <div className="fav-empty">
        <h2 className="view-title">My Favorites</h2>
        <p>Start reading and click "Add to Favorites" to save your manga here.</p>
      </div>
    );
  }

  return (
    <div className="fav-view-container">
      <div className="fav-header">
        <h2 className="view-title">My Favorites</h2>

        <div className="fav-tabs-container">
          {folders.map(folder => (
            <button
              key={folder}
              className={`fav-tab ${activeFolder === folder ? 'active' : ''}`}
              onClick={() => setActiveFolder(folder)}
            >
              {folder === 'Currently Reading' && <span className="tab-icon">📖</span>}
              {folder === 'Plan to Read' && <span className="tab-icon">📅</span>}
              {folder === 'Completed' && <span className="tab-icon">✅</span>}
              {folder}
            </button>
          ))}
        </div>
      </div>
      
      {filteredFavorites.length === 0 ? (
        <div className="fav-empty">
          <p>No manga found in "{activeFolder}".</p>
        </div>
      ) : (
        <div className="fav-grid">
          {filteredFavorites.map(manga => (
          // IMPORTANT: Pass the manga ID to the routing handler
          <div key={manga.id} className="fav-grid-item" onClick={() => onSelectManga(manga)}>
            <div className="fav-cover-wrapper">
              <img 
                src={manga.cover || 'https://via.placeholder.com/150'} 
                alt={manga.title} 
                loading="lazy"
              />
              <button 
                className="fav-delete-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents navigation when deleting
                  removeFavorite(manga.id);
                }}
              >
                ×
              </button>
            </div>
            <h4 className="fav-item-title">{manga.title}</h4>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesView;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import FavoritesList from '../components/manga/FavoritesList';
import { Heart, Sparkles } from 'lucide-react';
import './FavoritesPage.css'; 

const FOLDERS = ["All", "Currently Reading", "Plan to Read", "Completed"];

const FavoritesPage = () => {
  const { favorites, updateFavoriteFolder } = useFavorites();
  const [activeTab, setActiveTab] = useState("All");

  const filteredFavorites = activeTab === "All"
    ? favorites
    : favorites.filter(fav => (fav.folder || "Currently Reading") === activeTab);

  return (
    <div className="favorites-page-container">
      <h2 className="favorites-page-title">My Library</h2>
      
      {favorites.length > 0 && (
        <div className="library-tabs-container">
          {FOLDERS.map((folder) => {
            const count = folder === "All" 
              ? favorites.length 
              : favorites.filter(f => (f.folder || "Currently Reading") === folder).length;
            return (
              <button
                key={folder}
                className={`library-tab ${activeTab === folder ? 'active' : ''}`}
                onClick={() => setActiveTab(folder)}
              >
                {folder} <span className="tab-count-badge">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="favorites-empty-placeholder glass-panel">
          <div className="empty-heart-wrapper">
            <Heart className="empty-heart-icon" />
          </div>
          <p>Your library is waiting to be filled!</p>
          <p className="empty-subtext">Discover epic stories, save them to your library, and get updates on new chapters.</p>
          
          <Link to="/" className="favorites-discover-btn">
            <Sparkles size={16} />
            <span>Discover Popular Manga</span>
          </Link>
        </div>
      ) : (
        <FavoritesList favorites={filteredFavorites} onUpdateFolder={updateFavoriteFolder} />
      )}
    </div>
  );
};

export default FavoritesPage;
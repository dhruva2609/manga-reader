import React from 'react';
import { useNavigate } from 'react-router-dom';
import MangaCard from './MangaCard';
import { FolderHeart } from 'lucide-react';
import './FavoritesList.css';

const FavoritesList = ({ favorites, onUpdateFolder }) => {
    const navigate = useNavigate();

    const handleSelectManga = (manga) => {
        navigate(`/manga/${manga.id}`);
    };

    if (!favorites || favorites.length === 0) {
        return (
            <div className="fav-empty-state" style={{ width: '100%' }}>
                <p>No favorites in this folder.</p>
            </div>
        );
    }

    return (
        <div className="favorites-grid-container">
            {favorites.map((manga) => (
                <div key={manga.id} className="favorite-grid-item-wrapper">
                    <div className="favorite-grid-item">
                        <MangaCard
                            manga={manga}
                            onSelect={handleSelectManga}
                            displayVariant="grid"
                        />
                    </div>
                    {onUpdateFolder && (
                        <div className="favorite-folder-selector">
                            <FolderHeart size={14} className="folder-selector-icon" />
                            <select
                                value={manga.folder || "Currently Reading"}
                                onChange={(e) => onUpdateFolder(manga.id, e.target.value)}
                                className="folder-dropdown"
                            >
                                <option value="Currently Reading">Currently Reading</option>
                                <option value="Plan to Read">Plan to Read</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FavoritesList;
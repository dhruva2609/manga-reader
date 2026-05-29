import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MangaCard from './MangaCard';
import { FolderHeart, ChevronDown } from 'lucide-react';
import './FavoritesList.css';

const FolderDropdown = ({ currentFolder, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const folders = ["Currently Reading", "Plan to Read", "Completed"];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="custom-folder-dropdown" ref={dropdownRef}>
            <div className="custom-folder-dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                <FolderHeart size={14} className="folder-selector-icon" />
                <span className="current-folder-text">{currentFolder || "Currently Reading"}</span>
                <ChevronDown size={14} className={`folder-chevron ${isOpen ? 'open' : ''}`} />
            </div>
            {isOpen && (
                <div className="custom-folder-dropdown-menu">
                    {folders.map(folder => (
                        <div 
                            key={folder}
                            className={`custom-folder-dropdown-item ${folder === (currentFolder || "Currently Reading") ? 'active' : ''}`}
                            onClick={() => {
                                onUpdate(folder);
                                setIsOpen(false);
                            }}
                        >
                            {folder}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

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
                        <FolderDropdown 
                            currentFolder={manga.folder}
                            onUpdate={(folder) => onUpdateFolder(manga.id, folder)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default FavoritesList;
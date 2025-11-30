import React from 'react';
import { useNavigate } from 'react-router-dom';
import MangaCard from './MangaCard';
import './FavoritesList.css';

const FavoritesList = ({ favorites }) => {
    const navigate = useNavigate();

    const handleSelectManga = (manga) => {
        navigate(`/manga/${manga.id}`);
    };

    if (!favorites || favorites.length === 0) {
        return (
            <div className="fav-empty">
                <p>Your favorites list is empty.</p>
                <p>Add some manga to see them here!</p>
            </div>
        );
    }

    return (
        <div className="favorites-grid-container">
            {favorites.map((manga) => (
                <MangaCard
                    key={manga.id}
                    manga={manga}
                    onSelect={() => handleSelectManga(manga)}
                    coverUrl={manga.coverUrl}
                    displayVariant="grid"
                />
            ))}
        </div>
    );
};

export default FavoritesList;
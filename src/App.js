import React, { useState, useCallback } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';

// --- API ---
import { searchManga } from "./api/mangadex";

// --- Layout Components ---
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// --- Page Components ---
import HomePage from './pages/HomePage';
import MangaPage from './pages/MangaPage';
import ReaderPage from './pages/ReaderPage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';


// --- Contexts ---
import { FavoritesProvider } from "./context/FavoritesContext";
import { ReadingProgressProvider } from "./context/ReadingProgressContext";

import "./App.css";

import Sakura from "./components/ui/Sakura";

function App() {
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = useCallback(async (query) => {
        if (!query) {
            setMangas([]);
            return;
        }
        setLoading(true);
        // Using the API wrapper
        const results = await searchManga(query);
        setMangas(results);
        setLoading(false);
    }, []);

    const onSelect = useCallback((manga) => {
        navigate(`/manga/${manga.id}`);
        setMangas([]); // Clear results after selection
    }, [navigate]);

    return (
        <FavoritesProvider>
            <ReadingProgressProvider>
                <div>
                    <Sakura />
                    <Navbar
                        mangas={mangas}
                        loading={loading}
                        onSearch={handleSearch}
                        onSelect={onSelect}
                    />
                    <div className="main-layout">
                        <main className="content">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/manga/:mangaId" element={<MangaPage />} />
                                <Route path="/read/:chapterId" element={<ReaderPage />} />
                                <Route path="/favorites" element={<FavoritesPage />} />
                                <Route path="/history" element={<HistoryPage />} />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </div>
            </ReadingProgressProvider>
        </FavoritesProvider>
    );
}

export default App;
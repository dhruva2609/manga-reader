import React, { useState, useCallback } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';

// --- API ---
import { searchManga } from "./api/mangadex";

// --- Layout Components ---
import Navbar from "./components/layout/Navbar";

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
    const results = await searchManga(query);
    setMangas(results);
    setLoading(false);
  }, []);

  const clearSearch = useCallback(() => {
    setMangas([]);
  }, []);

  const handleSelectManga = useCallback((manga) => {
    navigate(`/manga/${manga.id}`);
    setMangas([]); // Clear results after selection
  }, [navigate]);

  return (
    <FavoritesProvider>
      <ReadingProgressProvider>
        <div>
          <Navbar 
            mangas={mangas}
            loading={loading}
            onSearch={handleSearch}
            onSelectManga={handleSelectManga}
            onClearSearch={clearSearch}
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
          </div>
        </div>
      </ReadingProgressProvider>
    </FavoritesProvider>
  );
}

export default App;
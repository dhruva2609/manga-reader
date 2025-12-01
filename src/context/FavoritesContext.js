import React, { createContext, useContext, useEffect, useState } from "react";
import { getMangaTitle, getCoverUrl } from "../utils";
const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to parse favorites from cache", error);
      localStorage.removeItem("favorites"); // Clear corrupt data
    }
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (manga) => {
    if (favorites.some((fav) => fav.id === manga.id)) return;

    const title = getMangaTitle(manga) || manga.title;

    // Robustly find the cover URL
    let coverUrl = manga.coverUrl || manga.cover; 
    if (!coverUrl) {
        const coverRel = manga.relationships?.find((r) => r.type === "cover_art");
        const fileName = coverRel?.attributes?.fileName;
        if (fileName) {
            // FIX: Use the utility function
            coverUrl = getCoverUrl(manga.id, fileName, '.256.jpg'); 
        } else {
            coverUrl = "https://via.placeholder.com/150"; // Fallback placeholder
        }
    }

    // Create a clean, standardized object for the favorite item
    const favoriteManga = {
      id: manga.id,
      title: title,
      coverUrl: coverUrl,
      attributes: manga.attributes,
      relationships: manga.relationships,
    };

    setFavorites((prev) => [...prev, favoriteManga]);
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
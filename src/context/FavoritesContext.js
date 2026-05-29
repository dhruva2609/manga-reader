import React, { createContext, useContext, useEffect, useState } from "react";

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

  const addFavorite = (manga, folder = "Currently Reading") => {
    if (favorites.some((fav) => fav.id === manga.id)) return;
    setFavorites((prev) => [...prev, { ...manga, folder }]);
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  const getFavoriteFolder = (id) => {
    const found = favorites.find((fav) => fav.id === id);
    return found ? found.folder || "Currently Reading" : null;
  };

  const updateFavoriteFolder = (id, folder) => {
    setFavorites((prev) =>
      prev.map((fav) => (fav.id === id ? { ...fav, folder } : fav))
    );
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, getFavoriteFolder, updateFavoriteFolder }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
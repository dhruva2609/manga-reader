import React, { createContext, useContext, useEffect, useState } from "react";
import { getMangaTitle, getCoverUrl } from "../utils";
// Create the context
const ReadingProgressContext = createContext();

// Provider component
export function ReadingProgressProvider({ children }) {
  // Load progress from localStorage (or start empty)
  const [progress, setProgress] = useState(() => {
    const stored = localStorage.getItem("readingProgress");
    return stored ? JSON.parse(stored) : {};
  });

  // Persist progress to localStorage on change
  useEffect(() => {
    localStorage.setItem("readingProgress", JSON.stringify(progress));
  }, [progress]);

  /**
   * Update progress for a manga/chapter/page.
   * @param {Object} manga - The manga object (must have .id and .title)
   * @param {string} chapterId - The chapter ID
   * @param {string} chapterTitle - The chapter title
   * @param {number} pageIdx - The current page index (default 0)
   */
  const updateProgress = (manga, chapterId, chapterTitle, pageIdx = 0) => {
    const title = getMangaTitle(manga) || manga.title;

    let coverUrl = manga.coverUrl || manga.cover;
    if (!coverUrl) {
      const coverRel = manga.relationships?.find((r) => r.type === "cover_art");
      const fileName = coverRel?.attributes?.fileName;
      if (fileName) {
        // FIX: Use the utility function
        coverUrl = getCoverUrl(manga.id, fileName, '.256.jpg');
      } else {
        coverUrl = "https://via.placeholder.com/150"; // Fallback
      }
    }

    const cleanManga = {
      id: manga.id,
      title: title,
      coverUrl: coverUrl,
      attributes: manga.attributes,
      relationships: manga.relationships,
    };

    setProgress((prev) => ({
      ...prev,
      [manga.id]: {
        manga: cleanManga,
        chapterId,
        chapterTitle,
        pageIdx,
        updatedAt: Date.now(),
      },
    }));
  };

  /**
   * Get progress for a specific manga by ID.
   * @param {string} mangaId
   * @returns {Object|null}
   */
  const getMangaProgress = (mangaId) => progress[mangaId] || null;

  /**
   * Get the most recently read manga/chapter/page.
   * @returns {Object|null}
   */
  const getLastRead = () => {
    const all = Object.values(progress);
    if (!all.length) return null;
    all.sort((a, b) => b.updatedAt - a.updatedAt);
    return all[0];
  };

  /**
   * Get all reading progress as a list (for a progress page or dashboard).
   * @returns {Array}
   */
  const getAllProgress = () => Object.values(progress);

  return (
    <ReadingProgressContext.Provider
      value={{
        progress,
        updateProgress,
        getMangaProgress,
        getLastRead,
        getAllProgress,
      }}
    >
      {children}
    </ReadingProgressContext.Provider>
  );
}

// Custom hook for easy usage
export function useReadingProgress() {
  return useContext(ReadingProgressContext);
}
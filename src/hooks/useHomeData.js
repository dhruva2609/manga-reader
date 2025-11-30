import { useState, useEffect } from 'react';
import { getPopularManga } from '../api/mangadex';

export const useHomeData = () => {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const popular = await getPopularManga();
        setMangas(popular);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return { mangas, setMangas, loading, setLoading };
};
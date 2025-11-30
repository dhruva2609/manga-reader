import axios from 'axios';

// CRITICAL FIX: Change the BASE_URL from the external API to the local proxy route.
const BASE_URL = '/api/mangadex';

// Remove the explicit axios.defaults.headers.common['Accept'] line if it was there.

export const searchManga = async (query, includedTags = []) => {
  try {
    // The GET request now hits your Vercel deployment which forwards the request to MangaDex.
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        title: query,
        limit: 10,
        includes: ['cover_art'],
        includedTags: includedTags, 
        contentRating: ['safe', 'suggestive', 'erotica'],
      }
    });
    return res.data.data;
  } catch (error) {
    console.error('searchManga error:', error);
    return [];
  }
};

export const getMangaDetails = async (mangaId) => {
  try {
    const res = await axios.get(`${BASE_URL}/manga/${mangaId}`);
    return res.data.data;
  } catch (error) {
    console.error('getMangaDetails error:', error);
    return null;
  }
};

export const getChapters = async (mangaId) => {
  try {
    const res = await axios.get(`${BASE_URL}/manga/${mangaId}/feed`, {
      params: {
        translatedLanguage: ['en'],
        order: { chapter: 'asc' },
        limit: 100
      }
    });
    return res.data.data;
  } catch (error) {
    console.error('getChapters error:', error);
    return [];
  }
};

export const getChapterPages = async (chapterId) => {
  if (!chapterId) {
    console.error('getChapterPages error: chapterId is undefined');
    return [];
  }
  try {
    // This request uses the proxy BASE_URL
    const res = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
    const { baseUrl, chapter } = res.data;
    if (!chapter || !chapter.data || !chapter.hash) {
      console.error('getChapterPages error: Invalid chapter data', res.data);
      return [];
    }
    // The baseUrl returned here is a direct CDN link from MangaDex, so it stays external.
    return chapter.data.map(
      (file) => `${baseUrl}/data/${chapter.hash}/${file}` 
    );
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`getChapterPages error: Chapter ${chapterId} not found (404)`);
    } else {
      console.error('getChapterPages error:', error);
    }
    return [];
  }
};

export const getReaderData = async (chapterId) => {
  try {
    // All API calls must use the proxy BASE_URL
    const serverRes = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
    const { baseUrl, chapter: chapterData } = serverRes.data;
    const pageUrls = chapterData.data.map(file => `${baseUrl}/data/${chapterData.hash}/${file}`);

    const chapterRes = await axios.get(`${BASE_URL}/chapter/${chapterId}`);
    const mangaId = chapterRes.data.data.relationships.find(r => r.type === 'manga').id;

    const mangaRes = await axios.get(`${BASE_URL}/manga/${mangaId}`, {
      params: { includes: ['cover_art'] }
    });

    return {
      pages: pageUrls,
      manga: mangaRes.data.data,
      chapterTitle: chapterRes.data.data.attributes.title || `Chapter ${chapterRes.data.data.attributes.chapter}`
    };
  } catch (error) {
    console.error('getReaderData error:', error);
    return { pages: [], manga: null, chapterTitle: '' };
  }
};

export const getPopularManga = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 20,
        includes: ['cover_art'],
        order: { followedCount: 'desc' },
        contentRating: ['safe', 'suggestive'], 
        hasAvailableChapters: 'true'
      }
    });
    return res.data.data;
  } catch (error) {
    console.error('getPopularManga error:', error);
    return [];
  }
};

export const getTrendingManga = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 10,
        includes: ['cover_art', 'author'],
        order: { followedCount: 'desc' },
        contentRating: ['safe', 'suggestive'],
        hasAvailableChapters: 'true'
      }
    });
    return res.data.data;
  } catch (error) {
    console.error('getTrendingManga error:', error);
    return [];
  }
};

export const getRecentlyAddedManga = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/manga`, {
      params: {
        limit: 15,
        includes: ['cover_art'],
        order: { createdAt: 'desc' },
        contentRating: ['safe', 'suggestive'],
        hasAvailableChapters: 'true'
      }
    });
    return res.data.data;
  } catch (error) {
    console.error('getRecentlyAddedManga error:', error);
    return [];
  }
};
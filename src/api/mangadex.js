import axios from 'axios';

// FIX: Change the BASE_URL to point to the local Vercel Serverless Function
const BASE_URL = '/api/mangadex-proxy?path=';

const fetchData = async (endpoint, params = {}) => {
  try {
    // The endpoint will be appended to the 'path' query parameter in the Vercel function
    const res = await axios.get(`${BASE_URL}${endpoint}`, { params });
    return res.data.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

const fetchDataDetails = async (endpoint, params = {}) => {
  try {
    const res = await axios.get(`${BASE_URL}${endpoint}`, { params });
    return res.data.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
};

// =========================================================================
// All original API functions updated to use the proxy URL structure
// =========================================================================

export const searchManga = (query, includedTags = []) => 
  fetchData('manga', {
    title: query,
    limit: 10,
    includes: ['cover_art'],
    includedTags: includedTags, 
    contentRating: ['safe', 'suggestive', 'erotica'],
  });

export const getMangaDetails = (mangaId) => 
  fetchDataDetails(`manga/${mangaId}`);

export const getChapters = (mangaId) => 
  fetchData(`manga/${mangaId}/feed`, {
    translatedLanguage: ['en'],
    order: { chapter: 'asc' },
    limit: 100
  });

// NOTE: getChapterPages and getReaderData use the "at-home" endpoint which is a bit different.
// We must modify the getReaderData logic to use the proxy path structure carefully.

export const getReaderData = async (chapterId) => {
  try {
    // 1. Fetch Chapter and Server URLs (Parallel)
    const [chapterRes, serverRes] = await Promise.all([
      // Use the proxy for chapter details
      axios.get(`/api/mangadex-proxy?path=chapter/${chapterId}`), 
      // Use the proxy for server link, but the MangaDex server link is still a third-party server, 
      // and must be retrieved from the proxy response.
      axios.get(`/api/mangadex-proxy?path=at-home/server/${chapterId}`) 
    ]);

    const chapterData = chapterRes.data.data;
    const mangaId = chapterData.relationships.find(r => r.type === 'manga').id;

    // 2. Fetch Manga Details
    const mangaRes = await axios.get(`/api/mangadex-proxy?path=manga/${mangaId}`, {
      params: { includes: ['cover_art'] }
    });

    // 3. Construct Page URLs (Crucial Step)
    const { baseUrl, chapter: chapterFiles } = serverRes.data;
    // NOTE: MangaDex images cannot be proxied through Vercel easily and are meant to be loaded directly 
    // from the returned 'baseUrl' or its server. This step remains the same.
    const pageUrls = chapterFiles.data.map(file => `${baseUrl}/data/${chapterFiles.hash}/${file}`);

    return {
      pages: pageUrls,
      manga: mangaRes.data.data,
      chapterTitle: chapterData.attributes.title || `Chapter ${chapterData.attributes.chapter}`
    };
  } catch (error) {
    console.error('getReaderData error:', error);
    return { pages: [], manga: null, chapterTitle: '' };
  }
};

// ... remaining functions updated to use fetchDataDetails/fetchData
export const getPopularManga = () => 
  fetchData('manga', {
    limit: 20,
    includes: ['cover_art'],
    order: { followedCount: 'desc' },
    contentRating: ['safe', 'suggestive'], 
    hasAvailableChapters: 'true'
  });

export const getTrendingManga = () => 
  fetchData('manga', {
    limit: 10,
    includes: ['cover_art', 'author'],
    order: { followedCount: 'desc' },
    contentRating: ['safe', 'suggestive'],
    hasAvailableChapters: 'true'
  });

export const getRecentlyAddedManga = () => 
  fetchData('manga', {
    limit: 15,
    includes: ['cover_art'],
    order: { createdAt: 'desc' },
    contentRating: ['safe', 'suggestive'],
    hasAvailableChapters: 'true'
  });
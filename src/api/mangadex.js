import axios from 'axios';


const UPLOADS_URL = 'https://uploads.mangadex.org';
const BASE_URL =
    process.env.NODE_ENV === 'development'
        ? ''
        : '/api/mangadex';

console.log('--- API DEBUG: Environment and BASE_URL ---');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Resolved BASE_URL: ${BASE_URL}`);
console.log('-------------------------------------------');

export const searchManga = async (query, includedTags = []) => {
    const url = `${BASE_URL}/manga`;
    try {
        const res = await axios.get(url, { params: { title: query, limit: 10 } });

        // Check if res.data.data exists before accessing .length
        if (!res?.data?.data) {
            console.error("No data received from API");
            return [];
        }

        return res.data.data;
    } catch (error) {
        console.error('searchManga error:', error);
        return [];
    }
};

export const getMangaDetails = async (mangaId) => {
    try {
        const res = await axios.get(`${BASE_URL}/manga/${mangaId}`, {
            params: { includes: ['cover_art', 'author'] }
        });
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
    if (!chapterId) return [];

    try {
        const res = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
        const { baseUrl, chapter } = res.data;

        if (!chapter || !chapter.data || !chapter.hash) return [];

        // FIX: Construct the FULL target URL before passing to the proxy
        const pageUrls = chapter.data.map((file) => {
            const fullTargetUrl = `${baseUrl}/data/${chapter.hash}/${file}`;

            // In development, call directly. In production, use the /manga-image/ prefix.
            return process.env.NODE_ENV === 'development'
                ? fullTargetUrl
                : `/manga-image/${encodeURIComponent(fullTargetUrl)}`;
        });

        return pageUrls;
    } catch (error) {
        console.error('getChapterPages error:', error);
        return [];
    }
};

export const getCoverUrl = (mangaId, fileName) => {
    if (!mangaId || !fileName) return '';
    const fullTargetUrl = `${UPLOADS_URL}/covers/${mangaId}/${fileName}`;

    return process.env.NODE_ENV === 'development'
        ? fullTargetUrl
        : `/manga-image/${encodeURIComponent(fullTargetUrl)}`;
};

export const getReaderData = async (chapterId) => {
    const serverUrl = `${BASE_URL}/at-home/server/${chapterId}`;
    console.log(`DEBUG: Calling getReaderData Server URL: ${serverUrl}`); // <-- DEBUG

    try {
        // Step 1: Get pages list via proxy
        const serverRes = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
        const { baseUrl, chapter: chapterData } = serverRes.data;
        // CRITICAL FIX: Route page URLs through the internal image proxy in production.
        const imageHost = process.env.NODE_ENV === 'development' ? baseUrl : '/api/mangadex-img';
        const pageUrls = chapterData.data.map(file => {
            const fullTargetUrl = `${baseUrl}/data/${chapterData.hash}/${file}`;
            return process.env.NODE_ENV === 'development'
                ? fullTargetUrl
                : `/manga-image/${encodeURIComponent(fullTargetUrl)}`;
        });
        // Step 2 & 3: Get chapter and manga details
        const chapterUrl = `${BASE_URL}/chapter/${chapterId}`;
        const mangaUrl = `${BASE_URL}/manga/${chapterId}`;
        console.log(`DEBUG: Calling Chapter URL: ${chapterUrl}`); // <-- DEBUG

        const chapterRes = await axios.get(chapterUrl);
        const mangaId = chapterRes.data.data.relationships.find(r => r.type === 'manga').id;

        console.log(`DEBUG: Calling Manga Details URL: ${mangaUrl} with ID ${mangaId}`); // <-- DEBUG
        const mangaRes = await axios.get(`${BASE_URL}/manga/${mangaId}`, {
            params: { includes: ['cover_art'] }
        });

        console.log('DEBUG: getReaderData completed successfully.'); // <-- DEBUG
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
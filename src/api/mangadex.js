import axios from 'axios';
import { proxyImageUrl } from '../utils';

// In development, CRA's setupProxy.js handles /api/mangadex/* → https://api.mangadex.org/*
// In production, vercel.json handles the same rewrite.
// Both environments use the same /api/mangadex prefix.
const BASE_URL = '/api/mangadex';

/**
 * Custom params serializer: MangaDex v5 requires bracket-style arrays
 * (e.g. includes[]=cover_art&includes[]=author) but axios defaults to
 * indexed style (includes[0]=cover_art) which MangaDex rejects.
 */
const serializeParams = (params) => {
    const parts = [];
    for (const key in params) {
        const value = params[key];
        if (value === undefined || value === null) continue;

        if (Array.isArray(value)) {
            // MangaDex expects key[]=val
            value.forEach((v) => {
                parts.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`);
            });
        } else if (typeof value === 'object') {
            // Handle nested objects like order: { chapter: 'asc' }
            for (const subKey in value) {
                parts.push(
                    `${encodeURIComponent(key)}[${encodeURIComponent(subKey)}]=${encodeURIComponent(value[subKey])}`
                );
            }
        } else {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
    }
    return parts.join('&');
};

// Shared axios instance with correct serializer (Axios 1.x format)
const api = axios.create({
    paramsSerializer: {
        serialize: serializeParams
    }
});

export const searchManga = async (query, includedTags = []) => {
    try {
        const params = {
            limit: 30, // Fetch more initially
            includes: ['cover_art'],
            contentRating: ['safe', 'suggestive', 'erotica'],
            hasAvailableChapters: 'true',
            availableTranslatedLanguage: ['en'],
        };

        if (query && query.trim() !== '') {
            params.title = query;
        }

        if (includedTags && includedTags.length > 0) {
            params.includedTags = includedTags;
        }

        const res = await api.get(`${BASE_URL}/manga`, { params });
        return await filterMangaWithChapters(res.data.data, 10);
    } catch (error) {
        console.error('searchManga error:', error.message);
        return [];
    }
};

export const getMangaDetails = async (mangaId) => {
    console.log(`getMangaDetails: Requesting ${BASE_URL}/manga/${mangaId}`);
    try {
        const res = await api.get(`${BASE_URL}/manga/${mangaId}`, {
            params: { includes: ['cover_art', 'author', 'artist'] },
        });
        return res.data.data;
    } catch (error) {
        console.error('getMangaDetails error:', error.response?.data || error.message);
        return null;
    }
};

export const getChapters = async (mangaId) => {
    console.log(`getChapters: Requesting feed for ${mangaId}`);
    try {
        const res = await api.get(`${BASE_URL}/manga/${mangaId}/feed`, {
            params: {
                translatedLanguage: ['en'],
                order: { chapter: 'asc' },
                limit: 500,
                offset: 0,
                contentRating: ['safe', 'suggestive', 'erotica'],
            },
        });
        
        // Filter out external chapters (like MangaPlus links) and empty chapters
        const readableChapters = res.data.data.filter(chapter => 
            chapter.attributes.pages > 0 && 
            !chapter.attributes.externalUrl
        );
        
        return readableChapters;
    } catch (error) {
        console.error('getChapters error:', error.response?.data || error.message);
        return [];
    }
};

export const getChapterPages = async (chapterId) => {
    if (!chapterId) {
        console.error('getChapterPages error: chapterId is undefined');
        return [];
    }
    try {
        const res = await api.get(`${BASE_URL}/at-home/server/${chapterId}`);
        const { baseUrl, chapter } = res.data;

        if (!chapter || !chapter.data || !chapter.hash) {
            console.error('getChapterPages error: Invalid chapter data', res.data);
            return [];
        }

        return chapter.data.map((file) =>
            proxyImageUrl(`${baseUrl}/data/${chapter.hash}/${file}`)
        );
    } catch (error) {
        console.error('getChapterPages error:', error.message);
        return [];
    }
};

export const getReaderData = async (chapterId) => {
    try {
        // Step 1: Get page image list
        const serverRes = await api.get(`${BASE_URL}/at-home/server/${chapterId}`);
        const { baseUrl, chapter: chapterData } = serverRes.data;
        const pageUrls = chapterData.data.map((file) =>
            proxyImageUrl(`${baseUrl}/data/${chapterData.hash}/${file}`)
        );

        // Step 2: Get chapter details to find the manga ID
        const chapterRes = await api.get(`${BASE_URL}/chapter/${chapterId}`);
        const mangaId = chapterRes.data.data.relationships.find((r) => r.type === 'manga').id;

        // Step 3: Get manga details for title/cover
        const mangaRes = await api.get(`${BASE_URL}/manga/${mangaId}`, {
            params: { includes: ['cover_art'] },
        });

        return {
            pages: pageUrls,
            manga: mangaRes.data.data,
            chapterTitle:
                chapterRes.data.data.attributes.title ||
                `Chapter ${chapterRes.data.data.attributes.chapter}`,
        };
    } catch (error) {
        console.error('getReaderData error:', error.message);
        return { pages: [], manga: null, chapterTitle: '' };
    }
};

const filterMangaWithChapters = async (mangas, requiredCount) => {
    const valid = [];
    // Check in chunks of 5 to avoid hammering the API
    for (let i = 0; i < mangas.length; i += 5) {
        const chunk = mangas.slice(i, i + 5);
        const checks = await Promise.all(chunk.map(async (m) => {
            try {
                const res = await api.get(`${BASE_URL}/manga/${m.id}/feed`, {
                    params: { translatedLanguage: ['en'], limit: 50, contentRating: ['safe', 'suggestive', 'erotica'] }
                });
                
                // Check if there is at least one readable chapter
                const hasReadable = res.data.data.some(chapter => 
                    chapter.attributes.pages > 0 && 
                    !chapter.attributes.externalUrl
                );
                
                return hasReadable ? m : null;
            } catch (err) {
                return null;
            }
        }));
        
        valid.push(...checks.filter(Boolean));
        if (valid.length >= requiredCount) {
            break;
        }
    }
    return valid.slice(0, requiredCount);
};

export const getPopularManga = async () => {
    try {
        const res = await api.get(`${BASE_URL}/manga`, {
            params: {
                limit: 30, // Fetch more initially to account for filtered out items
                includes: ['cover_art'],
                order: { followedCount: 'desc' },
                contentRating: ['safe', 'suggestive'],
                hasAvailableChapters: 'true',
                availableTranslatedLanguage: ['en'],
            },
        });
        return await filterMangaWithChapters(res.data.data, 10);
    } catch (error) {
        console.error('getPopularManga error:', error.message);
        return [];
    }
};

export const getTrendingManga = async () => {
    try {
        const res = await api.get(`${BASE_URL}/manga`, {
            params: {
                limit: 25,
                includes: ['cover_art', 'author'],
                order: { followedCount: 'desc' },
                contentRating: ['safe', 'suggestive'],
                hasAvailableChapters: 'true',
                availableTranslatedLanguage: ['en'],
            },
        });
        return await filterMangaWithChapters(res.data.data, 10);
    } catch (error) {
        console.error('getTrendingManga error:', error.message);
        return [];
    }
};

export const getRecentlyAddedManga = async () => {
    try {
        const res = await api.get(`${BASE_URL}/manga`, {
            params: {
                limit: 30,
                includes: ['cover_art'],
                order: { createdAt: 'desc' },
                contentRating: ['safe', 'suggestive'],
                hasAvailableChapters: 'true',
                availableTranslatedLanguage: ['en'],
            },
        });
        return await filterMangaWithChapters(res.data.data, 15);
    } catch (error) {
        console.error('getRecentlyAddedManga error:', error.message);
        return [];
    }
};
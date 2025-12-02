export const getMangaTitle = (manga) => {
  if (!manga || !manga.attributes || !manga.attributes.title) return "Unknown Title";

  const titles = manga.attributes.title;

  // Try specific languages in order of preference
  if (titles.en) return titles.en;
  if (titles['ja-ro']) return titles['ja-ro']; // Japanese Romanized
  if (titles['ko-ro']) return titles['ko-ro']; // Korean Romanized
  if (titles['zh-ro']) return titles['zh-ro']; // Chinese Romanized

  // If none match, take the very first key available (e.g., Russian, Spanish)
  const firstKey = Object.keys(titles)[0];
  return firstKey ? titles[firstKey] : "Untitled Manga";
};

// --- CORRECTED IMAGE HOST UTILITIES ---

/**
 * Returns the correct image host based on the environment.
 */
export const getMangaImageHost = () => {
    return process.env.NODE_ENV === 'development'
        ? 'https://uploads.mangadex.org' 
        : '/api/mangadex-img'; // Use the Vercel Proxy function path
};

/**
 * Constructs the full URL for a manga cover image.
 */
export const getCoverUrl = (mangaId, fileName, size = '.256.jpg') => {
    const host = getMangaImageHost();
    return `${host}/covers/${mangaId}/${fileName}${size}`;
}
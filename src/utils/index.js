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
    // FIX 1: In production (Vercel), return the local proxy path
    // The vercel.json rewrite will map this to uploads.mangadex.org
    return process.env.NODE_ENV === 'development'
        ? 'https://uploads.mangadex.org' 
        : '/api/mangadex-img'; // <--- CRITICAL FIX
};

/**
 * Constructs the full URL for a manga cover image.
 */
export const getCoverUrl = (manga, size = '.256.jpg') => {
    if (!manga) return null;
    const host = getMangaImageHost();
    const coverRel = manga.relationships?.find((r) => r.type === "cover_art");
    // FIX 2: Correctly get the cover's file name from the relationship's attributes
    const fileName = coverRel?.attributes?.fileName;
    if (!fileName) return null;
    
    // The format is: HOST/covers/MANGA_ID/FILENAME.SIZE.jpg
    // In production, this becomes: /api/mangadex-img/covers/MANGA_ID/FILENAME.SIZE.jpg
    return `${host}/covers/${manga.id}/${fileName}${size}`;
};
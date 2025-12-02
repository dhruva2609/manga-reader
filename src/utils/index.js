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
        : '/api/mangadex-img';
};

/**
 * Constructs the full URL for a manga cover image.
 */
export const getCoverUrl = (manga, size = '.256.jpg') => {
    if (!manga) return null;
    const host = getMangaImageHost();
    const coverRel = manga.relationships?.find((r) => r.type === "cover_art");
    const fileName = coverRel?.attributes?.fileName;
    if (!fileName) return null;
    return `${host}/covers/${manga.id}/${fileName}${size}`;
};
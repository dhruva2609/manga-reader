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

/**
 * Returns a proxied image URL that works both in development (via CRA setupProxy)
 * and in production (via Vercel serverless function).
 *
 * Both environments use /manga-image?url=<encodedUrl> so the same code path works
 * everywhere — no NODE_ENV branching needed in the URL builder.
 */
export const proxyImageUrl = (directUrl) => {
  if (!directUrl) return null;
  return `/manga-image?url=${encodeURIComponent(directUrl)}`;
};

/**
 * Constructs the full proxied URL for a manga cover image.
 *
 * Accepts either:
 *   getCoverUrl(mangaObject)           — used by MangaPage.js
 *   getCoverUrl(mangaId, fileName)     — used by MangaCard.js
 */
export const getCoverUrl = (mangaOrId, fileNameOrSize, size = '.256.jpg') => {
  let mangaId, fileName;

  if (typeof mangaOrId === 'string') {
    // Called as getCoverUrl(mangaId, fileName)
    mangaId = mangaOrId;
    fileName = fileNameOrSize;
  } else {
    // Called as getCoverUrl(mangaObject) or getCoverUrl(mangaObject, size)
    const manga = mangaOrId;
    if (!manga) return null;
    mangaId = manga.id;
    const coverRel = manga.relationships?.find((r) => r.type === 'cover_art');
    fileName = coverRel?.attributes?.fileName;
    // If second arg is a size string (e.g. '.512.jpg'), use it
    if (typeof fileNameOrSize === 'string' && fileNameOrSize.startsWith('.')) {
      size = fileNameOrSize;
    }
  }

  if (!mangaId || !fileName) return null;

  // Direct MangaDex CDN URL
  const directUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}${size}`;
  return proxyImageUrl(directUrl);
};
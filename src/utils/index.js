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
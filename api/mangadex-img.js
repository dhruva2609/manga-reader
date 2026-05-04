const axios = require('axios');

module.exports = async (req, res) => {
  // Get the target URL from the ?url= query param (always URL-encoded)
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Missing required "url" query parameter.');
  }

  // Decode the URL in case it was double-encoded
  const targetUrl = decodeURIComponent(url);

  // Basic validation: only allow MangaDex CDN domains
  const allowed = [
    'https://uploads.mangadex.org',
    'https://s5.mangadex.org',
    'https://s4.mangadex.org',
    'https://s3.mangadex.org',
    'https://s2.mangadex.org',
    'https://s1.mangadex.org',
  ];
  const isAllowed = allowed.some((prefix) => targetUrl.startsWith(prefix));
  if (!isAllowed) {
    return res.status(403).send('Forbidden: URL not from an allowed MangaDex domain.');
  }

  try {
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer', // Required for binary image data
      headers: {
        'Referer': 'https://mangadex.org',
        'User-Agent': 'Manga-Reader/1.0',
      },
      timeout: 20000, // 20s timeout
    });

    // Forward content headers
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.status(200).send(response.data);
  } catch (e) {
    const status = e.response?.status || 500;
    console.error(`Image proxy error for ${targetUrl}:`, e.message);
    res.status(status).send('Proxy Error');
  }
};
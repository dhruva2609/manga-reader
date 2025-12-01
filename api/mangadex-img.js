const axios = require('axios');

// The base URL for MangaDex covers and chapter images
const IMAGE_CDN_BASE_URL = 'https://uploads.mangadex.org';

module.exports = async function handler(req, res) {
  try {
    // The client requests: /api/mangadex-img/covers/... or /api/mangadex-img/data/...
    // We need the part after /api/mangadex-img
    const path = req.url.replace('/api/mangadex-img', '');
    const targetUrl = `${IMAGE_CDN_BASE_URL}${path}`;

    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer', // handle binary data
      headers: {
        // Some CDNs block hotlinking; include a Referer to mimic legitimate traffic
        'Referer': 'https://mangadex.org/',
        'User-Agent': 'MangaReaderAppProxy/1.0',
        'Accept': 'image/*',
      }
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    // Cache aggressively at CDN/edge
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(response.status).send(Buffer.from(response.data));
  } catch (error) {
    console.error(`Image Proxy Error fetching:`, error && error.message ? error.message : error);
    // Transparent 1x1 GIF fallback
    res.status(500).setHeader('Content-Type', 'image/gif').send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64'));
  }
};

const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Missing required "url" query parameter.');
  }

  const targetUrl = decodeURIComponent(url);

  try {
    const urlObj = new URL(targetUrl);
    const hostname = urlObj.hostname;

    const isAllowed = 
      hostname.endsWith('.mangadex.org') || 
      hostname.endsWith('.mangadex.network') || 
      hostname === 'mangadex.org' ||
      hostname === 'mangadex.network';

    if (!isAllowed) {
      console.error('[image-proxy] Forbidden domain:', hostname);
      return res.status(403).send('Forbidden domain');
    }

    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer',
      headers: {
        'Referer': 'https://mangadex.org',
        'Origin': 'https://mangadex.org',
        // Use a real browser User-Agent to avoid being blocked by CDNs
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      timeout: 20000,
    });

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
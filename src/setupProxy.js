/**
 * CRA Development Proxy (http-proxy-middleware v2)
 *
 * Loaded automatically by react-scripts in development.
 * Proxies MangaDex API calls and image CDN requests through localhost,
 * eliminating CORS and Referer restrictions.
 *
 * IMPORTANT: If you modify this file, you MUST RESTART the dev server (npm start).
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // ── 1. MangaDex REST API ──────────────────────────────────────────────────
  app.use(
    '/api/mangadex',
    createProxyMiddleware({
      target: 'https://api.mangadex.org',
      changeOrigin: true,
      pathRewrite: { '^/api/mangadex': '' }, // strip prefix
      headers: { 
        'User-Agent': 'Manga-Reader/1.0',
        'Referer': 'https://mangadex.org'
      },
    })
  );

  // ── 2. Manga images (covers + chapter pages) ──────────────────────────────
  app.use('/manga-image', async (req, res) => {
    const raw = req.query.url;
    if (!raw) return res.status(400).send('Missing ?url= param');

    const targetUrl = decodeURIComponent(raw);

    try {
      const urlObj = new URL(targetUrl);
      const hostname = urlObj.hostname;

      // Allow any mangadex.org or mangadex.network subdomain
      const isAllowed = 
        hostname.endsWith('.mangadex.org') || 
        hostname.endsWith('.mangadex.network') || 
        hostname === 'mangadex.org' ||
        hostname === 'mangadex.network';

      if (!isAllowed) {
        console.error('[image-proxy] Blocked forbidden domain:', hostname);
        return res.status(403).send('Forbidden domain');
      }

      const axios = require('axios');
      const response = await axios.get(targetUrl, {
        responseType: 'arraybuffer',
        headers: {
          'Referer': 'https://mangadex.org',
          'Origin': 'https://mangadex.org',
          'User-Agent': 'Manga-Reader/1.0',
        },
        timeout: 20000,
      });

      res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=86400');
      res.status(200).send(response.data);
    } catch (e) {
      const status = e.response?.status || 500;
      console.error(`[image-proxy] Failed to fetch ${targetUrl}:`, e.message);
      // If the target returns 403, it means our headers (Referer/User-Agent) were rejected
      res.status(status).send('Image proxy error: ' + e.message);
    }
  });
};

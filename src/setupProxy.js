/**
 * CRA Development Proxy (http-proxy-middleware v2)
 *
 * Loaded automatically by react-scripts in development.
 * Proxies MangaDex API calls and image CDN requests through localhost,
 * eliminating CORS and Referer restrictions.
 *
 * In production (Vercel), vercel.json handles the same routing.
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // ── 1. MangaDex REST API ──────────────────────────────────────────────────
  // /api/mangadex/manga?... → https://api.mangadex.org/manga?...
  app.use(
    '/api/mangadex',
    createProxyMiddleware({
      target: 'https://api.mangadex.org',
      changeOrigin: true,
      pathRewrite: { '^/api/mangadex': '' }, // strip prefix
      headers: { 'User-Agent': 'Manga-Reader/1.0' },
    })
  );

  // ── 2. Manga images (covers + chapter pages) ──────────────────────────────
  // /manga-image?url=<encoded CDN url>  →  actual CDN image
  //
  // We use a custom Express handler (not http-proxy-middleware) because we
  // need to dynamically pick the target host from the query string, and
  // http-proxy-middleware v2's `router` doesn't support that cleanly for
  // query-param based routing.
  app.use('/manga-image', async (req, res) => {
    const raw = req.query.url;
    if (!raw) return res.status(400).send('Missing ?url= param');

    const targetUrl = decodeURIComponent(raw);

    // Only allow MangaDex CDN domains
    const allowed = [
      'https://uploads.mangadex.org',
      'https://s5.mangadex.org',
      'https://s4.mangadex.org',
      'https://s3.mangadex.org',
      'https://s2.mangadex.org',
      'https://s1.mangadex.org',
    ];
    if (!allowed.some((p) => targetUrl.startsWith(p))) {
      return res.status(403).send('Forbidden domain');
    }

    try {
      // Use node-fetch or http.get — axios is available as a project dep
      const axios = require('axios');
      const response = await axios.get(targetUrl, {
        responseType: 'arraybuffer',
        headers: {
          Referer: 'https://mangadex.org',
          'User-Agent': 'Manga-Reader/1.0',
        },
        timeout: 20000,
      });

      res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
      res.set('Cache-Control', 'public, max-age=86400');
      res.status(200).send(response.data);
    } catch (e) {
      const status = e.response?.status || 500;
      console.error('[image-proxy] error:', e.message);
      res.status(status).send('Image proxy error');
    }
  });
};

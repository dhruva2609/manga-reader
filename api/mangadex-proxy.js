const axios = require('axios');

module.exports = async (req, res) => {
    // The 'path' param comes from the vercel.json rewrite rule:
    //   /api/mangadex/:path*  →  /api/mangadex-proxy?path=:path*
    const { path } = req.query;
    if (!path) return res.status(400).json({ message: 'Missing path parameter' });

    // Reconstruct the raw query string, excluding our internal 'path' param.
    // We pass the query string as-is so MangaDex receives the exact param format
    // the client sent (e.g. includes[]=cover_art&order[chapter]=asc).
    const rawQuery = req.url.split('?')[1] || '';
    const forwardedQuery = rawQuery
        .split('&')
        .filter((part) => !part.startsWith('path='))
        .join('&');

    const targetUrl = `https://api.mangadex.org/${path}${forwardedQuery ? `?${forwardedQuery}` : ''}`;

    try {
        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: {
                'User-Agent': 'Manga-Reader/1.0',
                'Content-Type': req.headers['content-type'] || 'application/json',
            },
            // Return raw data so we can pipe it straight through
            responseType: 'arraybuffer',
            validateStatus: () => true, // forward all status codes
        });

        res.status(response.status);

        // Forward relevant response headers
        if (response.headers['content-type']) {
            res.setHeader('Content-Type', response.headers['content-type']);
        }
        if (response.headers['x-ratelimit-limit']) {
            res.setHeader('X-RateLimit-Limit', response.headers['x-ratelimit-limit']);
        }
        if (response.headers['x-ratelimit-remaining']) {
            res.setHeader('X-RateLimit-Remaining', response.headers['x-ratelimit-remaining']);
        }

        res.send(response.data);
    } catch (error) {
        console.error('MangaDex proxy error:', error.message);
        res.status(500).json({ message: 'Error proxying to MangaDex API', detail: error.message });
    }
};
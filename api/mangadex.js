const axios = require('axios');

const MANGADEX_BASE_URL = 'https://api.mangadex.org';

module.exports = async function handler(req, res) {
  try {
    // Build path from req.query.slug (if provided) or parse from the url
    let apiPath = '';
    if (req.query && req.query.slug) {
      const slug = req.query.slug;
      apiPath = Array.isArray(slug) ? slug.join('/') : slug;
    } else {
      apiPath = req.url.replace('/api/mangadex/', '');
    }

    const targetUrl = `${MANGADEX_BASE_URL}/${apiPath}`;

    const response = await axios.get(targetUrl, {
      params: req.query,
      headers: {
        'Accept': 'application/json',
      }
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy Error:', error && error.message ? error.message : error);
    if (error.response) {
      res.status(error.response.status).json({
        error: "API Proxy failed to fetch data from MangaDex.",
        details: error.response.data
      });
    } else {
      res.status(500).json({ error: "Internal Server Error during API call." });
    }
  }
};

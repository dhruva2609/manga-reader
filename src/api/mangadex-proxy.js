import axios from 'axios';

const MANGADEX_BASE_URL = 'https://api.mangadex.org';

export default async function handler(req, res) {
  const { slug, ...queryParams } = req.query;
  const apiPath = Array.isArray(slug) ? slug.join('/') : slug;
  const targetUrl = `${MANGADEX_BASE_URL}/${apiPath}`;

  try {
    const response = await axios.get(targetUrl, {
      params: queryParams,
      headers: {
        'Accept': 'application/json',
      }
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Proxy Error:', error.message);
    if (error.response) {
      res.status(error.response.status).json({
        error: "API Proxy failed to fetch data from MangaDex.",
        details: error.response.data
      });
    } else {
      res.status(500).json({ error: "Internal Server Error during API call." });
    }
  }
}
import axios from 'axios';

// The base URL for the external API we are proxying
const MANGADEX_BASE_URL = 'https://api.mangadex.org';

// This Vercel function will handle all requests made from the client.
export default async function handler(req, res) {
  // Extract the original path and query parameters from the client request
  const { path, ...params } = req.query;

  try {
    const response = await axios.get(`${MANGADEX_BASE_URL}/${path}`, {
      params: params,
      // Ensure we use the correct headers for the MangaDex API if necessary
      headers: {
        'Accept': 'application/json',
        // Note: For public APIs like MangaDex, no special Authorization or Referer is usually needed for GET requests via a proxy.
      }
    });

    // Set CORS headers for the client's request
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Send the data received from MangaDex back to the client
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error('Proxy Error:', error.message);
    // Handle specific HTTP errors from MangaDex
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
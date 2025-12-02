import axios from 'axios';

const IMAGE_CDN_BASE_URL = 'https://uploads.mangadex.org';

export default async function handler(req, res) {
  // FIX 1: Use req.query[0] if the rewrite worked as intended (capturing path as query param '0').
  // However, to be more robust, we'll try to reconstruct the path using URL:
  const path = req.url.replace('/api/mangadex-img', '');
  
  // Check if the path starts with a slash, if not, add it (Vercel routes usually include it)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const targetUrl = `${IMAGE_CDN_BASE_URL}${normalizedPath}`;

  const headers = {
    // Setting a friendly User-Agent is necessary for some CDNs/APIs
    'User-Agent': 'MangaReaderAppProxy/1.0',
    'Accept': 'image/*',
    // FIX 2 (CRITICAL): The absence of the Referer header is sometimes required 
    // to bypass CDN denial based on cross-origin context.
  };
  
  try {
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer', 
      headers: headers
    });

    // Set headers and send image data
    const contentType = response.headers['content-type'] || 'image/jpeg';
    
    res.setHeader('Content-Type', contentType);
    // Use the actual caching headers from the source if available, otherwise suggest caching
    if (response.headers['cache-control']) {
        res.setHeader('Cache-Control', response.headers['cache-control']);
    } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); 
    }
    
    res.status(response.status).send(Buffer.from(response.data));

  } catch (error) {
    console.error(`Image Proxy FAILED to fetch ${targetUrl}. Status: ${error.response?.status} Message:`, error.message);
    
    // Send a fallback transparent GIF on failure
    res.status(500).setHeader('Content-Type', 'image/gif').send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64'));
  }
}
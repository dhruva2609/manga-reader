import axios from 'axios';

// The base URL for MangaDex covers and chapter images
const IMAGE_CDN_BASE_URL = 'https://uploads.mangadex.org';

export default async function handler(req, res) {
  // 1. Extract the image path from the Vercel route
  // The client requests: /api/mangadex-img/covers/...
  // We need the part after /api/mangadex-img
  const path = req.url.replace('/api/mangadex-img', '');
  const targetUrl = `${IMAGE_CDN_BASE_URL}${path}`;

  try {
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer', // CRUCIAL: Must handle binary data
      headers: {
        // Essential to prevent 403 Forbidden errors from the CDN
        'Referer': 'https://mangadex.org/', 
        'User-Agent': 'MangaReaderAppProxy/1.0',
        'Accept': 'image/*',
      }
    });

    // 2. Set appropriate headers and send image data
    const contentType = response.headers['content-type'] || 'image/jpeg';
    
    res.setHeader('Content-Type', contentType);
    // Add aggressive caching headers since image files rarely change
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); 
    
    // Send the binary image data
    res.status(response.status).send(Buffer.from(response.data));

  } catch (error) {
    console.error(`Image Proxy Error fetching ${targetUrl}:`, error.message);
    // Return a transparent 1x1 GIF on failure to prevent broken image icons
    res.status(500).setHeader('Content-Type', 'image/gif').send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64'));
  }
}
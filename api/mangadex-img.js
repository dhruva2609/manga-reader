import axios from 'axios';

const IMAGE_CDN_BASE_URL = 'https://uploads.mangadex.org';

export default async function handler(req, res) {
  // Extract the image path (e.g., /covers/...)
  const path = req.url.replace('/api/mangadex-img', '');
  const targetUrl = `${IMAGE_CDN_BASE_URL}${path}`;

  const headers = {
    // FINAL CRITICAL FIX: Removed Referer to prevent CDN denial
    'User-Agent': 'MangaReaderAppProxy/1.0',
    'Accept': 'image/*',
  };
  
  try {
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer', // Crucial for binary data
      headers: headers
    });

    // Set headers and send image data
    const contentType = response.headers['content-type'] || 'image/jpeg';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); 
    
    res.status(response.status).send(Buffer.from(response.data));

  } catch (error) {
    console.error(`Image Proxy FAILED to fetch ${targetUrl}. Status: ${error.response?.status} Message:`, error.message);
    
    // Send a fallback transparent GIF on failure
    res.status(500).setHeader('Content-Type', 'image/gif').send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64'));
  }
}
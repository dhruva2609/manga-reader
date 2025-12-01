import axios from 'axios';

const IMAGE_CDN_BASE_URL = 'https://uploads.mangadex.org';

export default async function handler(req, res) {
  // Extract the image path (e.g., /covers/...)
  const path = req.url.replace('/api/mangadex-img', '');
  const targetUrl = `${IMAGE_CDN_BASE_URL}${path}`;

  try {
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer', // Crucial for binary data
      headers: {
        // CRITICAL FIX: Add Referer to bypass CDN security checks
        'Referer': 'https://mangadex.org/', 
        'User-Agent': 'MangaReaderAppProxy/1.0',
        'Accept': 'image/*',
      }
    });

    // Set headers and send image data
    const contentType = response.headers['content-type'] || 'image/jpeg';
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); 
    
    res.status(response.status).send(Buffer.from(response.data));

  } catch (error) {
    console.error(`Image Proxy Error fetching ${targetUrl}:`, error.message);
    // Send a fallback transparent GIF on failure
    res.status(500).setHeader('Content-Type', 'image/gif').send(Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64'));
  }
}
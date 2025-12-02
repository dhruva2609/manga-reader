import axios from 'axios';

const IMAGE_CDN_BASE_URL = 'https://uploads.mangadex.org';

export default async function handler(req, res) {
  // Vercel usually passes the full URL in req.url
  // If the request is /api/mangadex-img/covers/abc.jpg
  // We want path to be /covers/abc.jpg
  const path = req.url.replace('/api/mangadex-img', '');
  
  // If path is empty or just query params, the replace might have failed or URL structure is different
  if (!path || path === '/') {
      return res.status(400).json({ error: "Image path missing" });
  }

  const targetUrl = `${IMAGE_CDN_BASE_URL}${path}`;

  const headers = {
    'User-Agent': 'MangaReaderAppProxy/1.0',
    'Accept': 'image/*',
    // Explicitly setting Referer to null or empty often helps with MangaDex
    'Referer': '' 
  };
  
  try {
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer',
      headers: headers
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';
    
    res.setHeader('Content-Type', contentType);
    // Cache aggressive to save Vercel function invocations
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, immutable'); 
    
    res.status(200).send(Buffer.from(response.data));

  } catch (error) {
    console.error(`Proxy Error: ${targetUrl}`, error.message);
    res.status(500).send('Error fetching image');
  }
}
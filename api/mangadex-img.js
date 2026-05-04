const axios = require('axios');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('No URL');

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer', // Required for images
      headers: {
        'Referer': 'https://mangadex.org',
        'User-Agent': 'Manga-Reader/1.0'
      }
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(response.data);
  } catch (e) {
    res.status(500).send('Proxy Error');
  }
};
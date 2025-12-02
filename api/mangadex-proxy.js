// dhruva2609/manga-reader/manga-reader-f58796ab705a3c3bbf7e7f41f9a569d6ca35e059/api/mangadex-proxy.js
const axios = require('axios');

module.exports = async (req, res) => {
    // FIX: The slug parameter from the rewrite rule (vercel.json) is a single path string
    // (e.g., 'manga' or 'at-home/server/chapterId') and should be used directly.
    const { slug } = req.query;
    let url = `https://api.mangadex.org/${slug}`;

    // Reconstruct query parameters manually to handle array-style params (e.g., includes[])
    // which are crucial for MangaDex endpoints.
    const queryParams = new URLSearchParams();

    for (const key in req.query) {
        // Skip the rewrite's own slug parameter
        if (key !== 'slug') { 
            const value = req.query[key];
            if (Array.isArray(value)) {
                // Append multiple values for keys like includes[]
                value.forEach(v => queryParams.append(key, v));
            } else {
                queryParams.set(key, value);
            }
        }
    }
    
    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    try {
        const response = await axios({
            method: req.method,
            url: url,
            // Pass the request body for POST/PUT/PATCH requests
            data: req.body,
            headers: {
                // MangaDex prefers a User-Agent header
                'User-Agent': 'Manga-Reader/1.0',
            }
        });

        // Forward headers and status
        res.status(response.status);
        if (response.headers['content-type']) {
            res.setHeader('Content-Type', response.headers['content-type']);
        }

        res.send(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send({ message: 'Error proxying to MangaDex API' });
        }
    }
};
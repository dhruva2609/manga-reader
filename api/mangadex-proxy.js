const axios = require('axios');

module.exports = async (req, res) => {
    const { slug } = req.query;
    let url = `https://api.mangadex.org/${slug.join('/')}`;

    // Pass through query parameters from the original request
    const params = new URLSearchParams(req.query);
    params.delete('slug'); // The slug is part of the path, not query params for mangadex
    
    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    try {
        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            headers: {
                'User-Agent': 'Manga-Reader/1.0'
            }
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send({ message: 'Error proxying to MangaDex API' });
        }
    }
};
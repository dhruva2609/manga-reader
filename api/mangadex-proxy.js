import fetch from 'node-fetch';

/**
 * Vercel Serverless Function to proxy requests to the MangaDex API.
 * This is necessary because of the vercel.json rewrite rule:
 * "/api/mangadex/(.*)" -> "/api/mangadex-proxy?slug=$1"
 * @param {import('@vercel/node').VercelRequest} req 
 * @param {import('@vercel/node').VercelResponse} res
 */
export default async (req, res) => {
    // Extract the slug (the part after /api/mangadex/) from the query
    const { slug } = req.query;
    
    // The base URL for the external API
    const targetUrlBase = 'https://api.mangadex.org';
    
    // Construct the full path and query string for the external API
    const targetPath = Array.isArray(slug) ? slug.join('/') : slug;
    
    // Build the query string from all original request query params except 'slug'
    const queryParams = new URLSearchParams();
    for (const key in req.query) {
        if (key !== 'slug') {
            // Handle arrays (e.g., includes[]=cover_art)
            if (Array.isArray(req.query[key])) {
                req.query[key].forEach(val => queryParams.append(key, val));
            } else {
                queryParams.set(key, req.query[key]);
            }
        }
    }

    const targetUrl = `${targetUrlBase}/${targetPath}?${queryParams.toString()}`;
    
    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            // Forward headers if needed, but usually Mangadex API doesn't require complex ones
        });
        
        // Copy headers from the target response to the proxy response
        response.headers.forEach((value, name) => {
            // Exclude potentially problematic headers
            if (name !== 'content-encoding' && name !== 'transfer-encoding') {
                res.setHeader(name, value);
            }
        });

        // Set the status code from the target response
        res.status(response.status);

        // Send the response body
        const data = await response.json();
        res.send(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Failed to proxy request to MangaDex API.' });
    }
};
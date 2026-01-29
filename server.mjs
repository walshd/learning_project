import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper for strict path resolution
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const PORT = 8080;
let REED_API_KEY = '';

// Try to load API Key
try {
    const config = await import('./config.js');
    REED_API_KEY = config.REED_API_KEY;
} catch (e) {
    console.warn("⚠️  config.js not found or invalid. API proxy will fail.");
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);

    // 1. API Proxy Endpoint for Reed Jobs
    if (req.url.startsWith('/api/jobs')) {
        if (!REED_API_KEY) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'API Key missing on server.' }));
            return;
        }

        // Parse query params to forward? For now, hardcode or pass through.
        // The client currently requests: keywords=junior web developer&location=manchester...
        // Let's just create a fixed robust query for this lesson
        const targetUrl = 'https://www.reed.co.uk/api/1.0/search?keywords=junior%20web%20developer&resultsToTake=50';

        try {
            const apiRes = await fetch(targetUrl, {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(REED_API_KEY + ':').toString('base64')
                }
            });

            if (!apiRes.ok) throw new Error(`Upstream API Error: ${apiRes.status}`);

            const data = await apiRes.json();
            
            // Forward headers and data
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (err) {
            console.error('Proxy Error:', err);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to fetch from Reed API' }));
        }
        return;
    }

    // 2. Static File Server
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 DevDash Server running at http://localhost:${PORT}`);
    console.log(`🔑 API Key Provider: ${REED_API_KEY ? 'Loaded from config.js' : 'MISSING'}`);
});

const express = require('express');
const cors = require('cors');
const path = require('path');

// In-memory storage for shared timers
const sharedTimers = new Map();

function createServer() {
    const app = express();

    // Middleware with proper CORS and JSON parsing settings
    app.use(cors());
    app.use(express.json({ limit: '1mb' }));
    app.use(express.static(path.join(__dirname, './')));

    // Debug logging middleware
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        if (req.method === 'POST') {
            console.log('Request body:', req.body);
        }
        next();
    });

    // API endpoints for shared timers
    app.post('/api/share', (req, res) => {
        try {
            console.log('Received share request:', req.body);
            if (!req.body || !req.body.title || !req.body.dateTime) {
                console.log('Invalid request data');
                return res.status(400).json({ error: 'Invalid timer data' });
            }

            const shareId = Math.random().toString(36).substr(2, 9);
            sharedTimers.set(shareId, req.body);
            console.log('Timer shared successfully with ID:', shareId);
            res.json({ shareId });
        } catch (error) {
            console.error('Server error while sharing:', error);
            res.status(500).json({ error: 'Server error', details: error.message });
        }
    });

    app.get('/api/share/:id', (req, res) => {
        try {
            const timer = sharedTimers.get(req.params.id);
            if (timer) {
                res.status(200).json(timer);
            } else {
                res.status(404).json({ error: 'Timer not found' });
            }
        } catch (error) {
            console.error('Error getting timer:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // Routes
    app.get('/share/:id', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index.html'));
    });

    // API endpoints
    app.get('/api/time', (req, res) => {
        res.json({ serverTime: new Date().toISOString() });
    });

    return app;
}

module.exports = createServer;

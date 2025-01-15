require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// In-memory storage for shared timers
const sharedTimers = new Map();

const app = express();
const port = process.env.PORT || 3002;
const host = '0.0.0.0';

// Middleware - Reihenfolge ist wichtig!
app.use(cors());
app.use(express.json());

// Debug logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Request body:', req.body);
    }
    next();
});

// API Routes zuerst
app.post('/api/share', (req, res) => {
    try {
        console.log('Share request received:', req.body);
        if (!req.body || !req.body.title || !req.body.dateTime) {
            return res.status(400).json({ error: 'Invalid timer data' });
        }
        const shareId = Math.random().toString(36).substr(2, 9);
        sharedTimers.set(shareId, req.body);
        console.log('Timer shared with ID:', shareId);
        res.json({ shareId });
    } catch (error) {
        console.error('Share error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/share/:id', (req, res) => {
    try {
        const timer = sharedTimers.get(req.params.id);
        if (timer) {
            res.json(timer);
        } else {
            res.status(404).json({ error: 'Timer not found' });
        }
    } catch (error) {
        console.error('Error getting timer:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Statische Dateien nach den API-Routes
app.use(express.static(path.join(__dirname)));

// Catch-all route als letztes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, host, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('Press CTRL-C to stop');
});

// Error handling
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

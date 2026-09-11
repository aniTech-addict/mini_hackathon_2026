import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './db/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Built-in & Third-party Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check / Root Route
app.get('/', async (req, res) => {
    try {
        const dbRes = await db.query('SELECT NOW()');
        res.status(200).json({
            message: 'Backend server is active and running!',
            status: 'success',
            database: 'connected',
            serverTime: dbRes.rows[0].now,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(200).json({
            message: 'Backend server is active and running!',
            status: 'degraded',
            database: 'disconnected',
            dbError: error.message,
            timestamp: new Date().toISOString(),
        });
    }
});

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route not found: ${req.originalUrl}`,
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

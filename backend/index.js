import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './db/db.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patient.routes.js';
import patientDataRoutes from './routes/patientData.routes.js';
import doctorRoutes from './routes/doctor.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Built-in & Third-party Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach sendStructuredResponse to every res object
app.use((req, res, next) => {
    res.sendStructuredResponse = (statusCode, message, data = null) => {
        return res.status(statusCode).json({
            status: statusCode,
            message,
            data,
        });
    };
    next();
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/patient', patientDataRoutes);
app.use('/api/v1/doctor', doctorRoutes);

// Health Check
app.get('/', async (req, res) => {
    try {
        const dbRes = await db.query('SELECT NOW()');
        res.sendStructuredResponse(200, 'Backend server is active and running!', {
            database: 'connected',
            serverTime: dbRes.rows[0].now,
        });
    } catch (error) {
        res.sendStructuredResponse(200, 'Backend server is active (DB degraded)', {
            database: 'disconnected',
            dbError: error.message,
        });
    }
});

// 404 Handler
app.use((req, res) => {
    res.sendStructuredResponse(404, `Route not found: ${req.originalUrl}`, null);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.sendStructuredResponse(err.status || 500, err.message || 'Internal Server Error', null);
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Import routes below once created
import authRoutes from './routes/authRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();

// 🟢 Request logger (First thing it does)
app.use((req, res, next) => {
    console.log(`\n--- [${new Date().toLocaleTimeString()}] INCOMING REQUEST ---`);
    console.log(`${req.method} ${req.originalUrl}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 🔵 Body logger (After JSON parsing)
app.use((req, res, next) => {
    if (req.method === 'POST') {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'SmartGrade API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ GLOBAL ERROR:', err);
    res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: err.message || 'Something went wrong!' }
    });
});

export default app;

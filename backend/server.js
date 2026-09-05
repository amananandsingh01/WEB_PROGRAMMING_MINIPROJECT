import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import requestRoutes from './src/routes/requestRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth',     authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/profile',  profileRoutes);
app.use('/api/users',    userRoutes);

// Serve Frontend Static Files
app.use(express.static(projectRoot));

// Root route redirects to landing page
app.get('/', (req, res) => {
    res.redirect('/campus-skill-exchange/index.html');
});


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
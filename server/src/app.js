
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Use relative paths correctly
const authRoutes = require('./routes/authRoutes').default;
const profileRoutes = require('./routes/profileRoutes').default;

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Global error handler caught an exception' });
});

module.exports = app;

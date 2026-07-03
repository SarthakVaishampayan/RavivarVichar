const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const env = require('./config/env');
const errorHandler = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

// CORS
app.use(
  cors({
    origin: [env.CLIENT_URL, env.ADMIN_URL].filter(Boolean),
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/v1', routes);

// Health check at root
app.get('/', (req, res) => {
  res.json({ success: true, message: 'RavivarVichar CMS API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;

// ============================================================
// server/app.js
// ============================================================

const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensorRoutes');

const app = express();

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Routes ----
app.use('/api', sensorRoutes);

// ---- Root ----
app.get('/', (req, res) => {
  res.json({ message: 'IKS Smart Water Advisor API. See /api/health for status.' });
});

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ status: 'ERROR', message: 'Route not found.' });
});

// ---- Global error handler (safety net) ----
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ status: 'ERROR', message: 'Something went wrong on the server.' });
});

module.exports = app;

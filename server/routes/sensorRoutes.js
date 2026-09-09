// ============================================================
// server/routes/sensorRoutes.js
// ============================================================

const express = require('express');
const router = express.Router();

const {
  healthCheck,
  saveReading,
  getLatestReading,
  getHistory,
} = require('../controllers/sensorController');

router.get('/health', healthCheck);
router.get('/sensor/latest', getLatestReading);
router.get('/sensor/history', getHistory);
router.post('/sensor/data', saveReading);

module.exports = router;

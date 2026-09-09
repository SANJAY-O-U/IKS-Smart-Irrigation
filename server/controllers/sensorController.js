// ============================================================
// server/controllers/sensorController.js
// ============================================================

const pool = require('../config/db');
const { generateRecommendation } = require('../services/recommendationService');

// GET /api/health
function healthCheck(req, res) {
  res.json({
    status: 'OK',
    message: 'IKS Smart Water Advisor API is running',
  });
}

// POST /api/sensor/data
async function saveReading(req, res) {
  try {
    const { soil_moisture, temperature, humidity } = req.body;

    // ---- Validation ----
    if (soil_moisture === undefined || temperature === undefined || humidity === undefined) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'soil_moisture, temperature and humidity are all required.',
      });
    }

    const moisture = Number(soil_moisture);
    const temp = Number(temperature);
    const hum = Number(humidity);

    if ([moisture, temp, hum].some((v) => Number.isNaN(v))) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'soil_moisture, temperature and humidity must be numbers.',
      });
    }

    if (moisture < 0 || moisture > 100 || hum < 0 || hum > 100) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'soil_moisture and humidity must be between 0 and 100.',
      });
    }

    // ---- Recommendation logic ----
    const { status, recommendation } = generateRecommendation(moisture, temp, hum);

    // ---- Store in MySQL (parameterized query) ----
    const [result] = await pool.query(
      `INSERT INTO sensor_readings
        (soil_moisture, temperature, humidity, irrigation_status, recommendation)
       VALUES (?, ?, ?, ?, ?)`,
      [moisture, temp, hum, status, recommendation]
    );

    const [rows] = await pool.query(
      'SELECT * FROM sensor_readings WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      status: 'OK',
      message: 'Reading saved successfully.',
      data: rows[0],
    });
  } catch (err) {
    console.error('saveReading error:', err.message);
    res.status(500).json({ status: 'ERROR', message: 'Internal server error while saving reading.' });
  }
}

// GET /api/sensor/latest
async function getLatestReading(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM sensor_readings ORDER BY created_at DESC LIMIT 1'
    );

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'EMPTY',
        message: 'No live sensor data available.',
      });
    }

    res.json({ status: 'OK', data: rows[0] });
  } catch (err) {
    console.error('getLatestReading error:', err.message);
    res.status(500).json({ status: 'ERROR', message: 'Internal server error while fetching latest reading.' });
  }
}

// GET /api/sensor/history?limit=20&page=1&from=YYYY-MM-DD&to=YYYY-MM-DD
async function getHistory(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 200);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];

    if (req.query.from) {
      conditions.push('created_at >= ?');
      params.push(`${req.query.from} 00:00:00`);
    }
    if (req.query.to) {
      conditions.push('created_at <= ?');
      params.push(`${req.query.to} 23:59:59`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `SELECT * FROM sensor_readings ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM sensor_readings ${whereClause}`,
      params
    );

    res.json({
      status: 'OK',
      page,
      limit,
      total: countRows[0].total,
      data: rows,
    });
  } catch (err) {
    console.error('getHistory error:', err.message);
    res.status(500).json({ status: 'ERROR', message: 'Internal server error while fetching history.' });
  }
}

module.exports = { healthCheck, saveReading, getLatestReading, getHistory };

// ============================================================
// server/config/db.js
// MySQL connection pool, configured entirely via environment
// variables so credentials are never hard-coded.
// ============================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'iks_smart_water_advisor',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

// Quick startup check so a bad .env fails loudly instead of silently.
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('MySQL connected successfully.');
    conn.release();
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
    console.error('Check MYSQL_HOST / MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE in your .env file.');
  }
}

testConnection();

module.exports = pool;

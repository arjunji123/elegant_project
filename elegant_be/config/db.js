const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check DB connection when file loads
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected to MySQL Database');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1); // Stop server if DB not connected
  }
})();

module.exports = db;

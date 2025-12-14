const { Pool } = require('pg');
require('dotenv').config(); // טוען את משתני הסביבה מה-.env

// יצירת Pool עם משתני הסביבה
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } // חובה ל-Supabase
});

// פונקציה לבדיקה
async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(' חיבור ל-Supabase הצליח:', res.rows[0]);
  } catch (err) {
    console.error(' שגיאה בחיבור ל-Supabase', err);
  } finally {
    await pool.end();
  }
}

testConnection();

const { Pool } = require('pg'); // Import the Pool class from the 'pg' library to manage PostgreSQL connections.
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST ,
  port: process.env.DB_PORT ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully:', res.rows[0]);
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};
const { Pool } = require('pg'); // Import the Pool class from the 'pg' library to manage PostgreSQL connections.
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};
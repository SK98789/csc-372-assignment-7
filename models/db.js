/*
  Name: Sadie Korzekwa
  Date: 11.01.2025
  CSC 372-01

  this is the database file that handles the connection to the database as a pool.

*/

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

module.exports = pool;
const PG = require ('pg');
const env       = process.env.NODE_ENV || 'development';
const config    = require('../config/config.json')[env];

const pool = new PG.Pool({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
  max: 50,
  idleTimeoutMillis: 30000
});

module.exports = pool

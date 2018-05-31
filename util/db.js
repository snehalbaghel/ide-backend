const PG = require ('pg'),
  U = require ('./util')
;
const secrets = require('../secrets.json');

const pool = new PG.Pool({
  host: secrets.HOST,
  user: secrets.USER,
  password: secrets.PASS,
  database: secrets.DB_NAME,
  max: 50,
  idleTimeoutMillis: 30000
});

module.exports = pool

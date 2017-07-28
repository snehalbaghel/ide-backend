const PG = require ('pg'),
  U = require ('./util')
;

const pool = new PG.Pool({
  host: U.requireFromEnvironment('IDE_DB_HOST'),
  user: U.requireFromEnvironment('IDE_DB_USER'),
  password: U.requireFromEnvironment('IDE_DB_PASSWORD'),
  database: U.requireFromEnvironment('IDE_DB_NAME'),
  max: 50,
  idleTimeoutMillis: 30000
});

module.exports = pool

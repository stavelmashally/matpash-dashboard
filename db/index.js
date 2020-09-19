const { Pool } = require('pg');

const maindbpool = new Pool({
  user: 'matpash',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'maindb',
  max: 3000,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// use this details to connect into yout local db
const usersdbpool = new Pool({
  user: 'matpash',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'matpash',
  max: 3000,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = {
  query: (sql, params) => usersdbpool.query(sql, params),
  maindbpool,
};
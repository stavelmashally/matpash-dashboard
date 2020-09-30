const Pool = require('pg').Pool;

const maindbpool = new Pool({
  user: 'matpash',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'MainDB',
  max: 3000,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const dashboarddbpool = new Pool({
  user: 'matpash',
  password: '1234',
  host: 'localhost',
  port: 5432,
  database: 'DashboardsDB',
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
  database: 'UsersDB',
  max: 3000,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = { maindbpool, usersdbpool, dashboarddbpool };

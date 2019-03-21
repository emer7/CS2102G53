const { Pool } = require('pg')
const pool = new Pool({
  user: 'cs2102',
  host: 'localhost',
  database: 'project',
  password: '*****',
  port: 5432,
})

module.exports = pool;

const express = require('express');

const router = express.Router();

const pool = require('../config/db.js');

const sql_query = 'SELECT * FROM student_info';

/* GET users listing. */
router.get('/', (req, res, next) => {
  pool.query(sql_query, (err, data) => {
    res.send(data.rows);
  });
});

module.exports = router;

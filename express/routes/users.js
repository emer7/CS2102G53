var express = require('express');
var router = express.Router();

const { pool } = require('../config/db.js')

var sql_query = 'SELECT * FROM student_info';

/* GET users listing. */
router.get('/', function(req, res, next) {
  pool.query(sql_query, (err, data) => {
		res.send(data.rows);
	});
});

module.exports = router;

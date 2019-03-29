const express = require('express');
const query = require('./queries/queries');

const router = express.Router();

const pool = require('../config/db');

const sql_query = 'SELECT * FROM student_info';

/* GET users listing. */
router.get('/', (req, res, next) => {
  pool.query(sql_query, (err, data) => {
    res.send(data.rows);
  });
});

// Route to create users
router.post('/create', query.createUser);

// Route to delete users
router.delete('/delete/:userSSN', query.deleteUser);

// Route to update users
router.put('/update', query.updateUser);

// Route to find all current borrowers of his/her item
router.get('/search/borrowers/:loanedByUserSSN', query.searchBorrower);

// Route to find the most active borrower
router.get('search/most_active', query.viewMostActiveBorrower);

// Route to find user with the most number of positive feedback
router.get('/search/most_positive', query.viewMostPositiveUser);

// Route to create feedbacks
router.post('/feedback/create', query.createFeedback);

// Route to delete feedbacks
router.delete('/feedback/delete/:feedbackSSN', query.deleteFeedback);

// Route to view all feedbacks for a specific user
router.get('/feedback/view_all/:receivedByUserSSN', query.viewAllFeedback);


module.exports = router;

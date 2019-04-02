const express = require('express');
const bcrypt = require('bcrypt');

const queries = require('../queries/queries');
const pool = require('../config/db');

const router = express.Router();

// Route to create users
router.post('/create', queries.createUser);

// Route to delete users
router.delete('/delete/:userSSN', queries.deleteUser);

// Route to update users
router.put('/update', queries.updateUser);

// Route to find all current borrowers of his/her item
router.get('/search/borrowers/:loanedByUserSSN', queries.searchBorrower);

// Route to find the most active borrower
router.get('/search/most_active', queries.viewMostActiveBorrower);

// Route to find user with the most number of positive feedback
router.get('/search/most_positive', queries.viewMostPositiveUser);

// Route to create feedbacks
router.post('/feedback/create', queries.createFeedback);

// Route to delete feedbacks
router.delete('/feedback/delete/:feedbackSSN', queries.deleteFeedback);

// Route to view all feedbacks for a specific user
router.get('/feedback/view_all/:receivedByUserSSN', queries.viewAllFeedback);

router.get('/detail/:userSSN', (req, res) => {
  const { userSSN } = req.params;

  const query = 'SELECT userssn, username, name, age, email, dob, phonenum, address, nationality FROM users WHERE userssn = $1';
  const values = [userSSN];

  pool.query(query, values, (errorQuery, resultQuery) => {
    if (errorQuery) {
      res.send(errorQuery);
    } else {
      res.send(resultQuery.rows[0]);
    }
  });
});

router.post('/register', (req, res) => {
  const {
    username, password, name, age, email, dob, phoneNum, address, nationality,
  } = req.body;

  bcrypt.hash(password, 12, (errorHash, hash) => {
    if (errorHash) {
      res.send({ message: 'Password cannot be empty' });
    } else {
      const query = 'INSERT INTO users (username, password, name, age, email, dob, phonenum, address, nationality) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const values = [username, hash, name, age, email, dob, phoneNum, address, nationality];

      pool.query(query, values, (errorQuery) => {
        if (errorQuery) {
          res.send(errorQuery);
        } else {
          res.send(true);
        }
      });
    }
  });
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt');

const queries = require('../queries/queries');
const pool = require('../config/db');

const router = express.Router();

// USED - Route to get all users except oneself
router.get('/all/except/:userSSN', queries.getAllUserExceptSelf);

// USED - // Route to delete users
router.delete('/delete/:userSSN', queries.deleteUser);

// USED - // Route to update users
router.put('/update', queries.updateUser);

// USED - // Route to update password
router.put('/update/password', queries.updatePassword);

// Route to find all current borrowers of his/her item
router.get('/search/borrowers/:loanedBySSN', queries.searchBorrower);

// Route to find the most active borrower
router.get('/search/most_active', queries.viewMostActiveBorrower);

// Route to find user with the most number of positive feedback
router.get('/search/most_positive', queries.viewMostPositiveUser);

// USED - // Route to create feedbacks
router.post('/feedback/create', queries.createFeedback);

// USED - // Route to delete feedbacks
router.delete('/feedback/delete/:feedbackSSN', queries.deleteFeedback);

// USED - // Route to update feedback
router.put('/feedback/update', queries.updateFeedback);

// Route to view user's good feedbacks
router.get('/feedback/view/good/:receivedByUserSSN', queries.viewGoodFeedbacks);

// Route to view user's bad feedbacks
router.get('/feedback/view/bad/:receivedByUserSSN', queries.viewBadFeedbacks);

// USED - // Route to view all feedbacks for a specific user
router.get('/feedback/view/all/:receivedByUserSSN', queries.viewAllFeedback);

// USED - // Route to view all feedbacks given by a user
router.get('/feedback/view/all/given/:givenByUserSSN', queries.viewAllGivenFeedback);

// USED - 
router.get('/detail/:userSSN', (request, response) => {
  const { userSSN } = request.params;

  const query = 'SELECT userssn, username, name, age, email, dob, phonenum, address, nationality FROM users WHERE userssn = $1';
  const values = [userSSN];

  pool.query(query, values, (errorQuery, resultQuery) => {
    if (errorQuery) {
      response.send(errorQuery);
    } else {
      response.send(resultQuery.rows[0]);
    }
  });
});

// USED - 
router.post('/register', (request, response) => {
  const {
    username,
    password,
    name,
    age,
    email,
    dob,
    phoneNum,
    address,
    nationality,
  } = request.body;

  bcrypt.hash(password, 12, (errorHash, hash) => {
    if (errorHash) {
      response.send({ errorMessage: 'Password cannot be empty' });
    } else {
      const query = 'INSERT INTO users (username, password, name, age, email, dob, phonenum, address, nationality) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const values = [username, hash, name, age, email, dob, phoneNum, address, nationality];

      pool.query(query, values, (errorQuery) => {
        if (errorQuery) {
          response.send(errorQuery);
        } else {
          response.send(true);
        }
      });
    }
  });
});

module.exports = router;

const express = require('express');
const queries = require('../queries/queries');

const router = express.Router();

// Route to register new user
router.post('/register', queries.userRegister);

// Route to update users
router.put('/update', queries.userUpdate);

// Route to update password
router.put('/update/password', queries.userUpdatePassword);

// Route to delete users
router.delete('/delete/:userSSN', queries.userDelete);

// Route to get user detail
router.get('/detail/:userSSN', queries.userDetail);

// Route to get all users except oneself
router.get('/all/except/:userSSN', queries.userAllExcept);

// Route to find the most active borrower
router.get('/search/most/active/borrower', queries.userSearchMostActive);

// Route to find user with the most number of positive feedback
router.get('/search/most/positive/feedback', queries.userSearchMostPositive);

// Route to get most popular loaner
router.get('/search/most/popular/loaner', queries.userSearchMostPopular);

// Route to create feedbacks
router.post('/feedback/create', queries.feedbackCreate);

// Route to update feedback
router.put('/feedback/update', queries.feedbackUpdate);

// Route to delete feedbacks
router.delete('/feedback/delete/:feedbackSSN', queries.feedbackDelete);

// Route to view all feedbacks for a specific user
router.get('/feedback/view/all/:receivedByUserSSN', queries.feedbackViewAll);

// Route to view all feedbacks given by a user
router.get('/feedback/view/all/given/:givenByUserSSN', queries.feedbackViewAllGiven);

module.exports = router;

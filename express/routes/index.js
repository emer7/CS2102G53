const express = require('express');
const query = require('./queries/queries')

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// Route to view all transactions on a user's items
router.get('/transactions/search/:loanerSSN', query.searchTransactions)

// Route to view all transaction status of all items he/she has borrowed
router.get('/transactions/view_all/:borrowerSSN', query.viewAllTransactionStatus)

// Route to accept winning bid
router.post('/winning_bid/accept', query.acceptWinningBid)

// Route to view the most expensive minimum bid
router.get('/bid/view/most_expensive', query.viewMostExpensiveMinBid)

// Route to create a new transaction and borrows when a winning bid is accepted
router.post('/transactions/add', query.addTransactionAndBorrows)

module.exports = router;

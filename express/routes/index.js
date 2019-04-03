const express = require('express');
const queries = require('../queries/queries');

const router = express.Router();

// Route to view all transactions on a user's items
<<<<<<< HEAD
router.get("/transactions/search/:loanerSSN", query.searchTransactions);

// Route to view all transaction status of all items he/she has borrowed
router.get("/transactions/view_all/:borrowerSSN", query.viewAllTransactionStatus);

// Route to accept winning bid
router.post("/winning_bid/accept", query.acceptWinningBid);

// Route to view the most expensive minimum bid
router.get("/bid/view/most_expensive", query.viewMostExpensiveMinBid);

// Route to create a new transaction and borrows when a winning bid is accepted
router.post("/borrow/add", query.addTransactionAndBorrows);
=======
router.get('/transactions/search/:loanerSSN', queries.searchTransactions);

// Route to view all transaction status of all items he/she has borrowed
router.get('/transactions/view_all/:borrowerSSN', queries.viewAllTransactionStatus);

// Route to accept winning bid
router.post('/winning_bid/accept', queries.acceptWinningBid);

// Route to view the most expensive minimum bid
router.get('/bid/view/most_expensive', queries.viewMostExpensiveMinBid);

// Route to create a new transaction and borrows when a winning bid is accepted
router.post('/borrow/add', queries.addTransactionAndBorrows);
>>>>>>> 144354637b1888024fe40f1f3ad0bb1040a54f48

module.exports = router;

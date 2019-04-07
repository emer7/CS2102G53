const express = require('express');
const queries = require('../queries/queries');

const router = express.Router();

// Route to view all transactions on a user's items
router.get('/transactions/view/all/loan/:loanerSSN', queries.transactionViewAllLoaned);

// Route to view all transaction status of all items he/she has borrowed
router.get('/transactions/view/all/borrow/:borrowerSSN', queries.transactionViewAllBorrowed);

// USED - // Route to accept winning bid
router.post('/winning_bid/accept', queries.acceptWinningBid);

// Route to view the most expensive minimum bid
router.get('/bid/view/most_expensive', queries.viewMostExpensiveMinBid);

// Route to create a new transaction and borrows when a winning bid is accepted
router.post('/borrow/add', queries.addTransactionAndBorrows);

// USED - // Route to update payment to paid
router.put('/payment/update/paid', queries.paymentUpdateToPaid);

// USED - // Route to delete payment
router.delete('/payment/delete/:paymentSSN', queries.paymentDelete);

module.exports = router;

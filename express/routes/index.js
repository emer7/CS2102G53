const express = require('express');
const queries = require('../queries/queries');

const router = express.Router();

// Route to view all transactions on a user's items
router.get('/transactions/view/all/loan/:loanerssn', queries.transactionViewAllLoaned);

// Route to view all transaction status of all items he/she has borrowed
router.get('/transactions/view/all/borrow/:borrowerssn', queries.transactionViewAllBorrowed);

// Route to accept winning bid
router.post('/bid/winning/accept', queries.acceptWinningBid);

// Route to update payment to paid
router.put('/payment/update/paid', queries.paymentUpdateToPaid);

// Route to delete payment
router.delete('/payment/delete/:paymentssn', queries.paymentDelete);

module.exports = router;

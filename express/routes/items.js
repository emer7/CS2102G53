const express = require('express');
const queries = require('../queries/queries');

const router = express.Router();

// Route to create items
router.post('/create', queries.createItem);

// Route to delete items
router.delete('/delete/:itemSSN', queries.deleteItem);

// Route to search for all items under specific UserSSN
router.get('/search/all/:loanedByUserSSN', queries.searchAllItems);

// Route to search for items that are not loaned
router.get('/search/available/:loanedByUserSSN', queries.searchAvailableItems);

// Route to return item
router.put('/returned/:transactionSSN', queries.returnedItem);

// Route to view the most borrowed item
router.get('/search/most_borrowed', queries.viewMostBorrowedItem);

// Route to view all items
router.get('/view/all', queries.viewAllAvailableItems);

// Route to create bid
router.post('/bid/create', queries.createBid);

module.exports = router;

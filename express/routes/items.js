const express = require('express');
const query = require('../queries/queries');

const router = express.Router();

// Route to create items
router.post('/create', query.createItem);

// Route to delete items
router.delete('/delete/:itemSSN', query.deleteItem);

// Route to search for all items under specific UserSSN
router.get('/search/all/:loanedByUserSSN', query.searchAllItems);

// Route to search for items that are not loaned
router.get('/search/available/:loanedByUserSSN', query.searchAvailableItems);

// Route to return item
router.put('/returned/:transactionSSN', query.returnedItem);

// Route to view the most borrowed item
router.get('/search/most_borrowed', query.viewMostBorrowedItem);

// Route to view all items
router.get('/view/all', query.viewAllAvailableItems);

module.exports = router;

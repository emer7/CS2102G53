const express = require('express');
const query = require('./queries/queries');

const router = express.Router();

// Route to create items
router.post('/create', query.createItem);

// Route to delete items
router.delete('/delete/:itemSSN', query.deleteItem);

// Route to update items
router.put('/update/:itemSSN', query.loanedItem);

// Route to search for all items under specific UserSSN
router.get('/search/all/:loanedByUserSSN', query.searchAllItems);

// Route to search for items that are not loaned
router.get('/search/available/:loanedByUserSSN', query.searchAvailableItems);

// Route to change loan status when item is returned
router.put('/returned/:transactionSSN', query.returnedItem);

// Route to view the most borrowed item
router.get('/search/most_borrowed', query.viewMostBorrowedItem);

module.exports = router;

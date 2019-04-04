const express = require('express');
const queries = require('../queries/queries');

const router = express.Router();

// Route to create items
router.post('/create', queries.createItem);

// Route to delete items
router.delete('/delete/:itemSSN', queries.deleteItem);

// Route to update an existing item
router.put('/update', queries.updateItem);

// Route to search for all items under specific UserSSN
router.get('/search/all/:loanedByUserSSN', queries.searchAllItems);

// Route to search for items that are not loaned of loaner
router.get('/search/available/:loanedByUserSSN', queries.searchAvailableItemsOfLoaner);

// Route to return item
router.put('/returned/:transactionSSN', queries.returnedItem);

// Route to view the most borrowed item
router.get('/search/most_borrowed', queries.viewMostBorrowedItem);

// Route to view all items
router.get('/view/all', queries.viewAllAvailableItems);

// Route to view all items
router.get('/view/all/except/:loanedByUserSSN', queries.viewAllAvailableExceptMyItems);

// Route to view all items that I am currently borrowing
router.get('/view/all_i_am_borrowing/:borrowerSSN', queries.viewAllItemsIAmBorrowing);

// Route to view all a loaner's items that are borrowed
router.get('/view/my_items_on_loan/:loanedByUserSSN', queries.viewLentOutItems);

// Route to create bid
router.post('/bid/create', queries.createBid);

// Route to delete bid
router.delete('/bid/delete', queries.deleteBid);

// Route to view all bids of an item
router.get('/bid/view/all/item/:itemSSN', queries.viewAllItemBid);

// Route to view all bids that the user has posted
router.get('/bid/view/all/user/:placedBySSN', queries.viewAllMyBid);

module.exports = router;

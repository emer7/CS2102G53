const express = require('express');
const queries = require('../queries/queries');

const router = express.Router();

// USED - // Route to create items
router.post('/create', queries.createItem);

// USED - // Route to delete items
router.delete('/delete/:itemSSN', queries.deleteItem);

// USED - // Route to update an existing item
router.put('/update', queries.updateItem);

// Route to search for all items under specific UserSSN
router.get('/search/all/:loanedByUserSSN', queries.searchAllItems);

// USED - // Route to search for items that are not loaned of loaner
router.get('/view/all/loaned/not/:loanedByUserSSN', queries.searchAvailableItemsOfLoaner);

// Route to return item
router.put('/returned/:transactionSSN', queries.returnedItem);

// Route to view the most borrowed item
router.get('/search/most_borrowed', queries.viewMostBorrowedItem);

// Route to view all items
router.get('/view/all', queries.viewAllAvailableItems);

// USED - // Route to view all items
router.get('/view/all/except/:loanedByUserSSN', queries.viewAllAvailableExceptMyItems);

// USED - // Route to view all items that I am currently borrowing
router.get('/view/all/borrowing/:borrowerSSN', queries.viewAllItemsIAmBorrowing);

// USED - // Route to view all a loaner's items that are borrowed
router.get('/view/all/loaned/:loanedByUserSSN', queries.viewLentOutItems);

// USED - // Route to create bid
router.post('/bid/create', queries.createBid);

// USED - // Route to delete bid
router.delete('/bid/delete', queries.deleteBid);

// USED - // Route to view all bids of an item
router.get('/bid/view/all/item/:itemSSN', queries.viewAllItemBid);

// Route to view all bids that the user has posted
router.get('/bid/view/all/user/:placedBySSN', queries.viewAllMyBid);

// Route to view item attributes
router.get('/view/:itemSSN', queries.viewItem);

// USED - // Get all items where the bid is accepted but not borrowed yet
router.get('/view/all/accepted/:userSSN', queries.viewAllBidAcceptedItem);

module.exports = router;

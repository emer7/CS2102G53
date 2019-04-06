const express = require('express');
const queries = require('../queries/queries');

const router = express.Router();

// Route to create items
router.post('/create', queries.createItem);

// Route to view item attributes
router.get('/view/:itemSSN', queries.viewItem);

// // Route to search for all items under specific UserSSN
// router.get('/view/all/:loanedByUserSSN', queries.searchAllItems);

// // Route to view the most borrowed item
// router.get('/view/most_borrowed', queries.viewMostBorrowedItem);

// // Route to view all items
// router.get('/view/all', queries.viewAllAvailableItems);

// Route to view all items under specific search query
router.get('/view/all/except/:loanedByUserSSN/with/:searchQuery', queries.viewAllWithSearchQuery);

// Route to view all items except one self item
router.get('/view/all/except/:loanedByUserSSN', queries.viewAllAvailableExceptMyItems);

// Route to search for items that are not loaned of loaner
router.get('/view/all/loaned/not/:loanedByUserSSN', queries.searchAvailableItemsOfLoaner);

// Route to view all items that I am currently borrowing
router.get('/view/all/borrowing/:borrowerSSN', queries.viewAllItemsIAmBorrowing);

// Route to view all a loaner's items that are borrowed
router.get('/view/all/loaned/:loanedByUserSSN', queries.viewLentOutItems);

// Route to get all items where the bid is accepted but not borrowed yet
router.get('/view/all/accepted/:userSSN', queries.viewAllBidAcceptedItem);

// Route to get all items where the loaner is waiting for payment
router.get('/view/all/waiting/:loanedByUserSSN', queries.viewAllWaitingPaymentItem);

// Route to update an existing item
router.put('/update', queries.updateItem);

// Route to return item
router.put('/return/:transactionSSN', queries.returnedItem);

// Route to delete items
router.delete('/delete/:itemSSN', queries.deleteItem);

// Route to create bid
router.post('/bid/create', queries.createBid);

// Route to view all bids of an item
router.get('/bid/view/all/item/:itemSSN', queries.viewAllItemBid);

// Route to view all bids that the user has posted
router.get('/bid/view/all/user/:placedBySSN', queries.viewAllMyBid);

// Route to delete bid
router.delete('/bid/delete', queries.deleteBid);

module.exports = router;

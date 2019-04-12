const express = require('express');
const queries = require('../queries/queries');

const router = express.Router();

// Route to create items
router.post('/create', queries.itemCreate);

// Route to view item attributes
router.get('/view/:itemssn', queries.itemView);

// Route to update an existing item
router.put('/update', queries.itemUpdate);

// Route to return item
router.put('/return/:transactionssn', queries.itemReturn);

// Route to delete items
router.delete('/delete/:itemssn', queries.itemDelete);

// Route to view all items under specific search query
router.get('/view/all/except/:loanedbyssn/with/:searchquery', queries.viewAllExceptWith);

// Route to view all items except one self item
router.get('/view/all/except/:loanedbyssn', queries.viewAllExcept);

// Route to search for items that are not loaned of loaner
router.get('/view/all/loaned/not/:loanedbyssn', queries.viewAllLoanedNot);

// Route to view all items that I am currently borrowing
router.get('/view/all/borrowing/:borrowerssn', queries.viewAllBorrowing);

// Route to view all a loaner's items that are borrowed
router.get('/view/all/loaned/:loanedbyssn', queries.viewAllLoaned);

// Route to get all items where the bid is accepted but not borrowed yet
router.get('/view/all/accepted/:userssn', queries.viewAllAccepted);

// Route to get all items where the loaner is waiting for payment
router.get('/view/all/waiting/:loanedbyssn', queries.viewAllWaiting);

// Route to create bid
router.post('/bid/create', queries.bidCreate);

// Route to view all bids of an item
router.get('/bid/view/all/item/:itemssn', queries.bidViewAllItem);

// Route to view all bids that the user has posted
router.get('/bid/view/all/user/:placedbyssn', queries.bidViewAllUser);

// Route to delete bid
router.delete('/bid/delete', queries.bidDelete);

module.exports = router;

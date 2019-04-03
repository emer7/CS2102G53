const express = require('express');
const queries = require('../queries/queries');

const router = express.Router();

// Route to create items
<<<<<<< HEAD
router.post("/create", query.createItem);

// Route to delete items
router.delete("/delete/:itemSSN", query.deleteItem);

// Route to update an existing item
router.put("/update", query.updateItem);

// Route to search for all items under specific UserSSN
router.get("/search/all/:loanedByUserSSN", query.searchAllItems);

// Route to search for items that are not loaned of loaner
router.get("/search/available/:loanedByUserSSN", query.searchAvailableItemsOfLoaner);

// Route to return item
router.put("/returned/:transactionSSN", query.returnedItem);

// Route to view the most borrowed item
router.get("/search/most_borrowed", query.viewMostBorrowedItem);

// Route to view all items
router.get("/view/all", query.viewAllAvailableItems);

// Route to view all items that I am currently borrowing
router.get("/view/all_i_am_borrowing/:borrowerSSN", query.viewAllItemsIAmBorrowing);

//Route to view all a loaner's items that are borrowed
router.get("/view/my_items_on_loan/:loanedByUserSSN", query.viewLentOutItems);

// Route to create bid
router.post("/bid/create", query.createBid);

// Route to delete bid
router.delete("/bid/delete/:bidSSN", query.deleteBid);

// Route to view all bids of an item
router.get("/bid/view/all/item/:itemSSN", query.viewAllBidOfItem);

// Route to view all bids that the user has posted
router.get("bid/view/all/user/:placedBySSN", query.viewAllMyBid);
=======
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
>>>>>>> 144354637b1888024fe40f1f3ad0bb1040a54f48

module.exports = router;

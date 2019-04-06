const bcrypt = require('bcrypt');

const pool = require('../config/db');

// Deletes an exisiting user
const deleteUser = (request, response) => {
  request.logOut();

  const userSSN = parseInt(request.params.userSSN, 10);

  const query = 'DELETE FROM Users WHERE userSSN = $1';
  const values = [userSSN];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.send(true);
  });
};

// Updates an exisiting user
const updatePassword = (request, response) => {
  const { password, userssn } = request.body;

  bcrypt.hash(password, 12, (errorHash, hash) => {
    if (errorHash) {
      response.send({ message: 'Password cannot be empty' });
    } else {
      const query = 'UPDATE Users SET password = $1 WHERE userssn = $2';
      const values = [hash, userssn];
      pool.query(query, values, (errorQuery) => {
        if (errorQuery) {
          response.send(errorQuery);
        } else {
          response.send(true);
        }
      });
    }
  });
};

// Updates an exisiting user
const updateUser = (request, response) => {
  const {
    name, age, email, dob, phonenum, address, nationality, userssn,
  } = request.body;

  const query = 'UPDATE Users SET name = $1, age = $2, email = $3, dob = $4, phoneNum = $5, address = $6, nationality = $7 WHERE userssn = $8';
  const values = [name, age, email, dob, phonenum, address, nationality, userssn];
  pool.query(query, values, (errorQuery) => {
    if (errorQuery) {
      response.send(errorQuery);
    } else {
      response.send(true);
    }
  });
};

// Creates new item
const createItem = (request, response) => {
  const {
    userssn, name, description, minbidprice, loandurationindays,
  } = request.body;

  const query = 'INSERT INTO Items (loanedbyuserssn, name, description, minbidprice, loandurationindays) VALUES ($1, $2, $3, $4, $5)';
  const values = [userssn, name, description, minbidprice, loandurationindays];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ error, message: 'User not created' });
    } else {
      response.send({ message: 'Item created' }); // fix. UPDATE: query result is empty array
    }
  });
};

// Updates an existing item
const updateItem = (request, response) => {
  const {
    itemssn, userssn, name, description, minbidprice, loandurationindays,
  } = request.body;

  const query = 'UPDATE Items SET loanedByUserSSN = $1, name = $2, description = $3, minBidPrice = $4, loanDurationInDays = $5 WHERE itemSSN = $6';
  const values = [userssn, name, description, minbidprice, loandurationindays, itemssn];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.send(true);
  });
};

// View all available items
const viewAllAvailableItems = (request, response) => {
  const select = 'SELECT I.itemssn, I.loanedbyuserssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM (Items I INNER JOIN Users U ON I.loanedByUserSSN = U.userSSN) LEFT OUTER JOIN Transactions T on I.itemSSN = T.itemSSN ';
  const where = 'WHERE T.transactionSSN = NULL OR NOT EXISTS (select 1 FROM Transactions WHERE returnedStatus = FALSE AND itemSSN = T.itemSSN)';

  const query = select + from + where;
  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.send(results.rows);
  });
};

// Views attributes of an item
const viewItem = (request, response) => {
  const itemSSN = parseInt(request.params.itemSSN, 10);

  const select = 'SELECT I.itemssn, I.loanedbyuserssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM Items I INNER JOIN Users U ON I.loanedbyuserssn = U.userssn ';
  const where = 'WHERE itemSSN = $1';
  const values = [itemSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.send(results.rows[0]);
  });
};

// View all available items except mine
const viewAllAvailableExceptMyItems = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  const select = 'SELECT DISTINCT I.itemssn, I.loanedbyuserssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM (Items I INNER JOIN Users U ON I.loanedByUserSSN = U.userSSN) LEFT OUTER JOIN Transactions T on I.itemSSN = T.itemSSN ';
  const where = 'WHERE I.loanedByUserSSN <> $1 AND (T.transactionSSN = NULL OR NOT EXISTS (select 1 FROM Transactions WHERE returnedStatus = FALSE AND itemSSN = T.itemSSN))';
  const values = [loanedByUserSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.send(results.rows);
  });
};

// Deletes an exisiting item
const deleteItem = (request, response) => {
  const itemSSN = parseInt(request.params.itemSSN, 10);

  const query = 'DELETE FROM Items WHERE itemSSN = $1';
  const values = [itemSSN];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.send(true);
  });
};

// Loaner wants to search for all the items under specific userSSN
const searchAllItems = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  const query = 'SELECT * FROM Items WHERE loanedByUserSSN = $1';
  const values = [loanedByUserSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// View all your items that are currently lent out
const viewLentOutItems = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  const select = 'SELECT I.itemssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM ((Items I INNER JOIN Users U ON I.loanedByUserSSN = U.userSSN) INNER JOIN Transactions T ON I.itemSSN = T.itemSSN) INNER JOIN Payments P on P.paymentssn = T.paymentssn ';
  const where = 'WHERE I.loanedByUserSSN = $1 AND T.returnedStatus = FALSE AND P.paidStatus = TRUE';
  const values = [loanedByUserSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.send(results.rows);
  });
};

// Borrower wants to view all items that are currently borrowed by him/her
const viewAllItemsIAmBorrowing = (request, response) => {
  const borrowerSSN = parseInt(request.params.borrowerSSN, 10);

  const select = 'SELECT B.itemssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username, T.transactionssn ';
  const from = 'FROM (((Borrows B INNER JOIN Items I ON B.itemssn = I.itemssn) INNER JOIN Users U ON I.loanedbyuserssn = U.userssn) INNER JOIN Transactions T ON T.transactionSSN = B.transactionSSN) ';
  const where = 'WHERE T.returnedStatus = FALSE AND B.borrowerSSN = $1';
  const values = [borrowerSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Loaner wants to search for items that are not loaned yet
const searchAvailableItemsOfLoaner = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  const select = 'SELECT DISTINCT I.itemssn, I.loanedbyuserssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM (Items I INNER JOIN Users U ON I.loanedByUserSSN = U.userSSN) LEFT OUTER JOIN Transactions T on I.itemSSN = T.itemSSN ';
  const where = 'WHERE I.loanedByUserSSN = $1 AND (T.transactionSSN = NULL OR NOT EXISTS (select 1 FROM Transactions WHERE returnedStatus = FALSE AND itemSSN = T.itemSSN))';
  const values = [loanedByUserSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.send(results.rows);
  });
};

// Loaner wants to find all current borrowers of his/her item
const searchBorrower = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  const query = 'SELECT I.itemSSN, B.borrowSSN FROM Items I LEFT OUTER JOIN Borrows B ON I.itemSSN = B.transactionSSN WHERE I.loanedByUserSSN = $1';
  const values = [loanedByUserSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Loaner wants to check all transactions for all his items
const searchTransactions = (request, response) => {
  const loanerSSN = parseInt(request.params.loanerSSN, 10);

  const query = 'SELECT itemSSN, transactionSSN FROM Borrows WHERE itemSSN IN (SELECT itemSSN FROM Items WHERE loanerSSN = $1';
  const values = [loanerSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Accept winning bid
const acceptWinningBid = (request, response) => {
  const {
    bidssn, itemssn, bidamt, placedbyssn, userssn,
  } = request.body;

  const queryWinningBid = 'INSERT INTO WinningBids (bidSSN, itemSSN) VALUES ($1, $2)';
  const valuesWinningBid = [bidssn, itemssn];

  pool.query(queryWinningBid, valuesWinningBid, (errorWinningBids) => {
    if (errorWinningBids) {
      throw errorWinningBids;
    }

    const queryPayment = 'INSERT INTO Payments (paymentType, paidStatus, paymentAmount, madeByUserSSN, receivedByUserSSN) VALUES ($1, FALSE, $2, $3, $4) RETURNING *';
    const valuesPayment = ['AUTOMATIC', bidamt, placedbyssn, userssn];

    pool.query(queryPayment, valuesPayment, (errorPayments, resultsPayments) => {
      if (errorPayments) {
        throw errorPayments;
      }

      const { paymentssn } = resultsPayments.rows[0];

      const queryTransactions = 'INSERT INTO Transactions (itemSSN, paymentSSN, returnedStatus) VALUES ($1, $2, FALSE)';
      const valuesTransactions = [itemssn, paymentssn];

      pool.query(queryTransactions, valuesTransactions, (errorTransactions) => {
        if (errorTransactions) {
          throw errorTransactions;
        }
        response.send(true);
      });
    });
  });
};

// Update a payment to pay
const updatePaymentToPaid = (request, response) => {
  const { paymentssn } = request.body;

  const query = 'UPDATE Payments SET paidstatus = TRUE WHERE paymentssn = $1';
  const values = [paymentssn];

  pool.query(query, values, (error) => {
    if (error) throw error;
    response.send(true);
  });
};

// Create an new transaction and borrows upon accepting a winning bid
const addTransactionAndBorrows = (request, response) => {
  const {
    transactionSSN,
    itemSSN,
    paymentSSN,
    paidStatus,
    startDate,
    endDate,
    borrowerSSN,
  } = request.body;

  const queryTransactions = 'INSERT INTO Transactions (transactionSSN, paidStatus, startDate, endDate, returnedStatus) VALUES ($1, TRUE, $2, $3, FALSE)';
  const valuesTransactions = [transactionSSN, paidStatus, startDate, endDate];

  pool.query(queryTransactions, valuesTransactions, (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Transaction added with transactionSSN: ${transactionSSN}`);
  });

  const queryBorrows = 'INSERT INTO Borrows (itemSSN, borrowerSSN, transactionSSN) VALUES ($1, $2, $3)';
  const valuesBorrows = [itemSSN, borrowerSSN, transactionSSN];

  pool.query(queryBorrows, valuesBorrows, (error) => {
    if (error) {
      throw error;
    }
    response
      .status(200)
      .send(
        `Borrow record added for item: ${itemSSN}, borrower: ${borrowerSSN} with transaction: ${transactionSSN}`,
      );
  });
};

// Create a feedback
const createFeedback = (request, response) => {
  const {
    userssn, receivedbyuserssn, commenttype, commentbody,
  } = request.body;

  const query = 'INSERT INTO Feedbacks (givenByUserSSN, receivedByUserSSN, commentType, commentBody) VALUES ($1, $2, $3, $4)';
  const values = [userssn, receivedbyuserssn, commenttype, commentbody];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.send(true);
  });
};

// Delete a feedback
const deleteFeedback = (request, response) => {
  const feedbackSSN = parseInt(request.params.feedbackSSN, 10);

  const query = 'DELETE FROM Feedbacks WHERE feedbackSSN = $1';
  const values = [feedbackSSN];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.send(true);
  });
};

// Updates an existing feedback
const updateFeedback = (request, response) => {
  const { commenttype, commentbody, feedbackssn } = request.body;

  const query = 'UPDATE Feedbacks SET commentType = $1, commentBody = $2 WHERE feedbackSSN = $3';
  const values = [commenttype, commentbody, feedbackssn];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.send(true);
  });
};

// View all feedbacks to a specific user
const viewAllGivenFeedback = (request, response) => {
  const givenByUserSSN = parseInt(request.params.givenByUserSSN, 10);

  const select = 'SELECT F.feedbackSSN, F.receivedByUserSSN, F.commenttype, F.commentbody, U.username ';
  const from = 'FROM Feedbacks F INNER JOIN Users U ON F.receivedByUserSSN = U.userssn ';
  const where = 'WHERE givenByUserSSN = $1';
  const values = [givenByUserSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.send(results.rows);
  });
};

// View all feedbacks to a specific user
const viewAllFeedback = (request, response) => {
  const receivedByUserSSN = parseInt(request.params.receivedByUserSSN, 10);

  const select = 'SELECT F.feedbackSSN, F.givenByUserSSN, F.commenttype, F.commentbody, U.username ';
  const from = 'FROM Feedbacks F INNER JOIN Users U ON F.givenbyuserssn = U.userssn ';
  const where = 'WHERE receivedByUserSSN = $1';
  const values = [receivedByUserSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.send(results.rows);
  });
};

// View all of the user's good feedbacks
const viewGoodFeedbacks = (request, response) => {
  const receivedByUserSSN = parseInt(request.params.receivedByUserSSN, 10);

  const query = 'SELECT * FROM Feedbacks WHERE receivedByUserSSN = $1 AND commentType = GOOD';
  const values = [receivedByUserSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// View all of the user's bad feedbacks
const viewBadFeedbacks = (request, response) => {
  const receivedByUserSSN = parseInt(request.params.receivedByUserSSN, 10);

  const query = 'SELECT * FROM Feedbacks WHERE receivedByUserSSN = $1 AND commentType = BAD';
  const values = [receivedByUserSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// View all transactions status of all items he/she has borrowed
const viewAllTransactionStatus = (request, response) => {
  const borrowerSSN = parseInt(request.params.borrowerSSN, 10);

  const query = 'SELECT B.itemSSN, T.returnedStatus FROM Borrows NATURAL JOIN Transactions WHERE borrowerSSN = $1';
  const values = [borrowerSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// View the most borrowed item and its user
const viewMostBorrowedItem = (request, response) => {
  const query = 'SELECT itemSSN, COUNT(*) as numOfTimesBorrowed FROM Borrows GROUP BY itemSSN ORDER BY numOfTimesBorrowed desc';

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// View most expensive min bid price of an item
const viewMostExpensiveMinBid = (request, response) => {
  const query = 'SELECT itemSSN, minBidPrice FROM Items ORDER BY minBidPrice desc';

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// View most active borrower
const viewMostActiveBorrower = (request, response) => {
  const query = 'SELECT borrowerSSN, COUNT(*) as numOfTimesBorrowed FROM Borrows GROUP BY borrowerSSN ORDER BY numOfTimesBorrowed desc';

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// View user with most number of positive feedback
const viewMostPositiveUser = (request, response) => {
  const query = 'SELECT receivedByUserSSN, COUNT(*) as numOfTimesPraised FROM Feedbacks WHERE type = GOOD GROUP BY receivedByUserSSN ORDER BY numOfTimesPraised desc';

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Change loan status of item when item has been returned
const returnedItem = (request, response) => {
  const transactionSSN = parseInt(request.params.transactionSSN, 10);

  const query = 'UPDATE Transactions SET returnedStatus = TRUE WHERE transactionSSN = $1';
  const values = [transactionSSN];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.send(true);
  });
};

// Create a new bid
const createBid = (request, response) => {
  const { userssn, itemssn, bidamt } = request.body;

  const query = 'INSERT INTO Bids (placedBySSN, itemSSN, bidAmt, bidDateTime) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)';
  const values = [userssn, itemssn, bidamt];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.send(true);
  });
};

// Delete an existing bid
const deleteBid = (request, response) => {
  const { itemssn, userssn } = request.body;

  const query = 'DELETE FROM Bids WHERE itemSSN = $1 and placedBySSN = $2';
  const values = [itemssn, userssn];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.send(true);
  });
};

// Update an existing bid
// Need to edit to add in more fields
const updateBid = (request, response) => {
  const { bidSSN, bidAmt } = request.body;

  const query = 'UPDATE Bid SET bidAmt = $1 WHERE bidSSN = $2';
  const values = [bidAmt, bidSSN];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Bid with bidSSN ${bidSSN} updated to new amount of ${bidAmt}`);
  });
};

// View all bids of an item
const viewAllItemBid = (request, response) => {
  const itemSSN = parseInt(request.params.itemSSN, 10);

  const select = 'SELECT B1.bidSSN, B1.placedBySSN, B1.itemSSN, B1.bidAmt, B1.bidDateTime, U.username ';
  const from = 'FROM Bids B1 INNER JOIN Users U ON B1.placedBySSN = U.userSSN ';
  const where = 'WHERE B1.itemSSN = $1 and (B1.bidDateTime >= all (SELECT B2.bidDateTime FROM Bids B2 WHERE B2.placedBySSN = B1.placedBySSN and B2.itemSSN = B1.itemSSN))';
  const values = [itemSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.json(results.rows);
  });
};

// View all my bids that I have placed that has not been accepted as a winning bid
const viewAllMyBid = (request, response) => {
  const placedBySSN = parseInt(request.params.placedBySSN, 10);

  const select = 'SELECT B1.bidssn, B1.bidamt, B1.biddatetime, I.itemssn, I.NAME, I.minbidprice ';
  const from = 'FROM Bids B1 INNER JOIN Items I ON B1.itemssn = I.itemssn ';
  const where = 'WHERE B1.placedbyssn = $1 AND (B1.biddatetime >= ALL (SELECT B2.biddatetime FROM Bids B2 WHERE B2.placedbyssn = B1.placedbyssn AND B2.itemssn = B1.itemssn)) ';
  const and = 'AND NOT EXISTS (SELECT 1 FROM Transactions T INNER JOIN Payments P ON T.paymentssn = P.paymentssn WHERE T.returnedStatus = FALSE or P.paidstatus = FALSE AND T.itemssn = B1.itemssn)';
  const values = [placedBySSN];

  const query = select + from + where + and;
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.send(results.rows);
  });
};

// View winning bid of an item
const viewWinningBid = (request, response) => {
  const itemSSN = parseInt(request.params.itemSSN, 10);

  const query = 'SELECT * FROM WinningBids WHERE itemSSN = $1';
  const values = [itemSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Create a new payment once payment has been made
const createPayment = (request, response) => {
  const {
    paymentSSN, paymentType, paymentAmount, madeByUserSSN, receivedByUserSSN,
  } = request.body;

  const query = 'INSERT INTO Payments (paymentSSN, paymentType, paymentAmount, madeByUserSSN, receivedByUserSSN,) VALUES ($1, $2, $3, $4, $5)';
  const values = [paymentSSN, paymentType, paymentAmount, madeByUserSSN, receivedByUserSSN];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response
      .status(200)
      .send(`Payment made by ${madeByUserSSN} to ${receivedByUserSSN} is complete`);
  });
};

const getAllUserExceptSelf = (request, response) => {
  const userSSN = parseInt(request.params.userSSN, 10);

  const query = 'SELECT userssn, username, name FROM Users WHERE userssn <> $1';
  const values = [userSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.send(results.rows);
  });
};

const viewAllBidAcceptedItem = (request, response) => {
  const userSSN = parseInt(request.params.userSSN, 10);

  const select = 'SELECT I.itemssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username, P.paymentssn, T.transactionssn ';
  const from = 'FROM ((Items I INNER JOIN Users U ON I.loanedbyuserssn = U.userssn) INNER JOIN Transactions T ON I.itemssn = T.itemssn) INNER JOIN Payments P ON T.paymentssn = P.paymentssn ';
  const where = 'WHERE P.madebyuserssn = $1 AND P.paidstatus = false';
  const values = [userSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.send(results.rows);
  });
};

const deletePayment = (request, response) => {
  const paymentssn = parseInt(request.params.paymentSSN, 10);

  const query = 'DELETE FROM Payments WHERE paymentssn = $1';
  const values = [paymentssn];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.send(true);
  });
};

const viewAllWaitingPaymentItem = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  const select = 'SELECT I.itemssn, I.loanedbyuserssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM ((Items I INNER JOIN Users U ON I.loanedByUserSSN = U.userSSN) INNER JOIN Transactions T on I.itemSSN = T.itemSSN) INNER JOIN Payments P ON T.paymentssn = P.paymentssn ';
  const where = 'WHERE P.receivedByUserSSN = $1 AND P.paidstatus = false';
  const values = [loanedByUserSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.send(results.rows);
  });
};

module.exports = {
  deletePayment,
  deleteUser,
  updateUser,
  createItem,
  viewAllAvailableItems,
  deleteItem,
  updateItem,
  viewItem,
  viewAllItemsIAmBorrowing,
  searchAllItems,
  searchAvailableItemsOfLoaner,
  viewLentOutItems,
  searchBorrower,
  searchTransactions,
  acceptWinningBid,
  addTransactionAndBorrows,
  createFeedback,
  deleteFeedback,
  updateFeedback,
  viewAllFeedback,
  viewGoodFeedbacks,
  viewBadFeedbacks,
  viewAllTransactionStatus,
  viewMostBorrowedItem,
  viewMostExpensiveMinBid,
  viewMostActiveBorrower,
  viewMostPositiveUser,
  returnedItem,
  createBid,
  deleteBid,
  updateBid,
  viewWinningBid,
  createPayment,
  viewAllItemBid,
  viewAllMyBid,
  getAllUserExceptSelf,
  updatePassword,
  viewAllGivenFeedback,
  viewAllAvailableExceptMyItems,
  viewAllBidAcceptedItem,
  updatePaymentToPaid,
  viewAllWaitingPaymentItem,
};

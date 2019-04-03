const bcrypt = require('bcrypt');

const pool = require('../config/db');

// Deletes an exisiting user
const deleteUser = (request, response) => {
  const userSSN = parseInt(request.params.userSSN, 10);

  const query = 'DELETE FROM Users WHERE userSSN = $1';
  const values = [userSSN];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`${userSSN} successfully deleted`);
  });
};

// Updates an exisiting user
const updateUser = (request, response) => {
  const {
    username,
    password,
    name,
    age,
    email,
    dob,
    phonenum,
    address,
    nationality,
    userSSN,
  } = request.body;

  bcrypt.hash(password, 12, (errorHash, hash) => {
    if (errorHash) {
      response.send({ message: 'Password cannot be empty' });
    } else {
      const query = 'UPDATE Users SET username = $1, password = $2, name = $3, age = $4, email = $5, dob = $6, phoneNum = $7, address = $8, nationality = $9 WHERE userssn = $10';
      const values = [
        username,
        hash,
        name,
        age,
        email,
        dob,
        phonenum,
        address,
        nationality,
        userSSN,
      ];
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

// Creates new item
const createItem = (request, response) => {
  const {
    loanedByUserSSN, name, description, minBidPrice, loanDurationInDays,
  } = request.body;

  const query = 'INSERT INTO Items (loanedbyuserssn, name, description, minbidprice, loandurationindays) VALUES ($1, $2, $3, $4, $5)';
  const values = [loanedByUserSSN, name, description, minBidPrice, loanDurationInDays];

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
    itemSSN,
    loanedByUserSSN,
    name,
    description,
    minBidPrice,
    loanDurationInDays,
  } = request.body;

  const query = 'UPDATE Items SET loanedByUserSSN = $1, name = $2, description = $3, minBidPrice = $4, loanDuration = $5 WHERE itemSSN = $6';
  const values = [loanedByUserSSN, name, description, minBidPrice, loanDurationInDays, itemSSN];
  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`${itemSSN} has been updated`);
  });
};

// View all available items
// T.transactionSSN = NULL union is not in T.returnedStatus = FALSE
const viewAllAvailableItems = (request, response) => {
  const query = 'SELECT I.itemssn as itemssn, loanedbyuserssn, name, description, minbidprice, loandurationindays FROM Items I LEFT OUTER JOIN Transactions T on I.itemSSN = T.itemSSN where T.transactionSSN = NULL OR NOT EXISTS (select 1 FROM Transactions WHERE returnedStatus = FALSE AND itemSSN = T.itemSSN)';

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
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
    response.status(200).send(`${itemSSN} successfully deleted`);
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

  const query = 'SELECT * FROM Items I LEFT OUTER JOIN Transactions T ON I.itemSSN = T.itemSSN WHERE I.loanedByUserSSN = $1 AND T.returnedStatus = FALSE';
  const values = [loanedByUserSSN];
  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Borrower wants to view all items that are currently borrowed by him/her
const viewAllItemsIAmBorrowing = (request, response) => {
  const borrowerSSN = parseInt(request.params.borrowerSSN, 10);

  const query = 'SELECT * FROM Borrows B LEFT OUTER JOIN Transactions T ON T.transactionSSN = B.transactionSSN WHERE T.returnedStatus = FALSE AND B.borrowerSSN = $1';
  const values = [borrowerSSN];
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

  const query = 'SELECT I.itemssn as itemssn, loanedbyuserssn, name, description, minbidprice, loandurationindays FROM Items I LEFT OUTER JOIN Transactions T on I.itemSSN = T.itemSSN where I.loanedByUserSSN = $1 AND (T.transactionSSN = NULL OR NOT EXISTS (select 1 FROM Transactions WHERE returnedStatus = FALSE AND itemSSN = T.itemSSN))';
  const values = [loanedByUserSSN];

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
  const { bidSSN, itemSSN } = request.body;

  const query = 'INSERT INTO WinningBids (bidSSN, itemSSN) VALUES ($1, $2)';
  const values = [bidSSN, itemSSN];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Winning bid of item with SSN: ${itemSSN} with bid ${bidSSN}`);
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
    feedbackSSN, givenByUserSSN, receivedByUserSSN, typee, commentt,
  } = request.body;

  const query = 'INSERT INTO Feedbacks (feedbackSSN, givenByUserSSN, receivedByUserSSN, typee, commentt) VALUES ($1, $2, $3, $4, $5)';
  const values = [feedbackSSN, givenByUserSSN, receivedByUserSSN, typee, commentt];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Feedback added for ${receivedByUserSSN} given by ${givenByUserSSN}`);
  });
};

// Delete a feedback
const deleteFeedback = (request, response) => {
  const feedbackSSN = parseInt(request.params.feedbackSSN, 10);

  const query = 'DELETE FROM Feedbacks WHERE feedbackSSN = $1';
  const values = [feedbackSSN];

  pool.qeury(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Feedback deleted with feedbackSSN: ${feedbackSSN}`);
  });
};

// Updates an existing feedback
const updateFeedback = (request, response) => {
  const { feedbackSSN, commentType, commentBody } = request.body;

  const query = 'UPDATE Feedbacks SET commentType = $1, commentBody = $2 WHERE feedbackSSN = $3';
  const values = [commentType, commentBody, feedbackSSN];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`${feedbackSSN} has been updated`);
  });
};

// View all feedbacks to a specific user
const viewAllFeedback = (request, response) => {
  const receivedByUserSSN = parseInt(request.params.receivedByUserSSN, 10);

  const query = 'SELECT type, comment givenByUserSSN, date FROM Feedbacks WHERE receivedByUserSSN = $1 ORDER BY date desc';
  const values = [receivedByUserSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
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
  const query = 'SELECT receivedByUserSSN, COUNT(*) as numOfTimesPraised FROM Feedbacks WHERE typee = GOOD GROUP BY receivedByUserSSN ORDER BY numOfTimesPraised desc';

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
    response.status(200).send(`Transaction with transactionSSN ${transactionSSN} updated`);
  });
};

// Create a new bid
const createBid = (request, response) => {
  const {
    bidSSN, placedBySSN, itemSSN, bidAmt, dateTime,
  } = request.body;

  const query = 'INSERT INTO Bids (bidSSN, placedBySSN, itemSSN, bidAmt, dateTime) VALUES ($1, $2, $3, $4, $5)';
  const values = [bidSSN, placedBySSN, itemSSN, bidAmt, dateTime];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Bid for ${itemSSN} placed with bidSSN: ${bidSSN}`);
  });
};

// Delete an existing bid
const deleteBid = (request, response) => {
  const bidSSN = parseInt(request.params.bidSSN, 10);

  const query = 'DELETE FROM Bids WHERE bidSSN = $1';
  const values = [bidSSN];

  pool.query(query, values, (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`${bidSSN} successfully deleted`);
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

  const query = 'SELECT * FROM Bids WHERE itemSSN = $1';
  const values = [itemSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// View all my bids that I have placed
const viewAllMyBid = (request, response) => {
  const placedBySSN = parseInt(request.params.placedBySSN, 10);

  const query = 'SELECT * FROM Bids WHERE placedBySSN = $1';
  const values = [placedBySSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
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

module.exports = {
  deleteUser,
  updateUser,
  createItem,
  viewAllAvailableItems,
  deleteItem,
  updateItem,
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
};

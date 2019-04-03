const bcrypt = require('bcrypt');

const pool = require('../config/db');

// Creates new user
const createUser = (request, response) => {
  const {
    userSSN,
    userName,
    password,
    name,
    age,
    email,
    dob,
    phoneNum,
    address,
    nationality,
  } = request.body;

  pool.query(
    "INSERT INTO Users (userSSN, userName, password, name, age, email, dob, phoneNum, address, nationality) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
    [userSSN, userName, password, name, age, email, dob, phoneNum, address, nationality],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User added with UserSSN: ${results.insertUserSSN}`);
    },
  );
};

// Deletes an exisiting user
const deleteUser = (request, response) => {
  const userSSN = parseInt(request.params.userSSN, 10);

  pool.query("DELETE FROM Users WHERE userSSN = $1", [userSSN], (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`${userSSN} successfully deleted`);
  });
};

// Updates an exisiting user
const updateUser = (request, response) => {
  const {
    userName,
    password,
    name,
    age,
    email,
    dob,
    phoneNum,
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

  pool.query(
    'INSERT INTO Items (loanedbyuserssn, name, description, minbidprice, loanDurationInDays) VALUES ($1, $2, $3, $4, $5)',
    [loanedByUserSSN, name, description, minBidPrice, loanDurationInDays],
    (error) => {
      if (error) {
        response.send({ error, message: 'User not created' });
      } else {
        response.send(`Item added with ItemSSN: ${'itemSSN'}`); // fix. UPDATE: query result is empty array
      }
    },
  );
};

// Updates an existing item
const updateItem = (request, response) => {
  const {
    itemSSN, loanedByUserSSN, name, description, minBidPrice, loanDurationInDays,
  } = request.body;

  pool.query(
    "UPDATE Items SET loanedByUserSSN = $1, name = $2, description = $3, minBidPrice = $4, loanDuration = $5 WHERE itemSSN = $6",
    [loanedByUserSSN, name, description, minBidPrice, loanDurationInDays, itemSSN],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`${itemSSN} has been updated`);
    },
  );
};

// View all available items
// T.transactionSSN = NULL union is not in T.returnedStatus = FALSE
const viewAllAvailableItems = (request, response) => {
  pool.query("SELECT * FROM Items I LEFT OUTER JOIN Transactions T on I.itemSSN = T.itemSSN where T.transactionSSN = NULL OR NOT EXISTS (select 1 WHERE T.returnedStatus = FALSE)",
    (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Deletes an exisiting item
const deleteItem = (request, response) => {
  const itemSSN = parseInt(request.params.itemSSN, 10);

  pool.query("DELETE FROM Items WHERE itemSSN = $1", [itemSSN], (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`${itemSSN} successfully deleted`);
  });
};

// Loaner wants to search for all the items under specific userSSN
const searchAllItems = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  pool.query("SELECT * FROM Items WHERE loanedByUserSSN = $1", [loanedByUserSSN], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// View all your items that are currently lent out
const viewLentOutItems = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  pool.query(
    "SELECT * FROM Items I LEFT OUTER JOIN Transactions T ON I.itemSSN = T.itemSSN WHERE I.loanedByUserSSN = $1 AND T.returnedStatus = FALSE",
    [loanedByUserSSN], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
}

// Borrower wants to view all items that are currently borrowed by him/her
const viewAllItemsIAmBorrowing = (request, response) => {
  const borrowerSSN = parseInt(request.prarms.borrowerSSN, 10);

  pool.query(
    "SELECT * FROM Borrows B LEFT OUTER JOIN Transactions T ON T.transactionSSN = B.transactionSSN WHERE T.returnedStatus = FALSE AND B.borrowerSSN = $1",
    [borrowerSSN], (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// Loaner wants to search for items that are not loaned yet owned by the loaner
const searchAvailableItemsOfLoaner = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  pool.query(
    "SELECT * FROM Items I LEFT OUTER JOIN Transactions T WHERE I.loanedByUserSSN = $1 AND (T.transactionSSN = NULL OR T.returnedStatus = TRUE)",
    [loanedByUserSSN],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.send(results.rows);
    },
  );
};

// Loaner wants to find all current borrowers of his/her item
const searchBorrower = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  pool.query(
    "SELECT I.itemSSN, B.borrowSSN FROM Items I LEFT OUTER JOIN Borrows B ON I.itemSSN = B.transactionSSN WHERE I.loanedByUserSSN = $1",
    [loanedByUserSSN],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// Loaner wants to check all transactions for all his items
const searchTransactions = (request, response) => {
  const loanerSSN = parseInt(request.params.loanerSSN, 10);

  pool.query(
    "SELECT itemSSN, transactionSSN FROM Borrows WHERE itemSSN IN (SELECT itemSSN FROM Items WHERE loanerSSN = $1",
    [loanerSSN],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// Accept winning bid
const acceptWinningBid = (request, response) => {
  const { bidSSN, itemSSN } = request.body;

  pool.query(
    "INSERT INTO WinningBids (bidSSN, itemSSN) VALUES ($1, $2)",
    [bidSSN, itemSSN],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Winning bid of item with SSN: ${itemSSN} with bid ${bidSSN}`);
    },
  );
};

// Create an new transaction and borrows upon accepting a winning bid
const addTransactionAndBorrows = (request, response) => {
  const {
    transactionSSN, itemSSN, paymentSSN, paidStatus, startDate, endDate, borrowerSSN,
  } = request.body;

  pool.query(
    "INSERT INTO Transactions (transactionSSN, itemSSN, paymentSSN, paidStatus, startDate, endDate, returnedStatus) VALUES ($1, $2, $3, FALSE, $4, $5, FALSE)",
    [transactionSSN, itemSSN, paymentSSN, startDate, endDate],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Transaction added with transactionSSN: ${transactionSSN}`);
    },
  );

  pool.query(
    "INSERT INTO Borrows (itemSSN, borrowerSSN, transactionSSN) VALUES ($1, $2, $3)",
    [itemSSN, borrowerSSN, transactionSSN],
    (error) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(
          `Borrow record added for item: ${itemSSN}, borrower: ${borrowerSSN} with transaction: ${transactionSSN}`,
        );
    },
  );
};

// Create a feedback
const createFeedback = (request, response) => {
  const {
    feedbackSSN, 
    givenByUserSSN,
    receivedByUserSSN,
    commentType,
    commentBody,
  } = request.body;

  pool.query(
    "INSERT INTO Feedbacks (feedbackSSN, givenByUserSSN, receivedByUserSSN, commentType, commentBody) VALUES ($1, $2, $3, $4, $5)",
    [feedbackSSN, givenByUserSSN, receivedByUserSSN, commentType, commentBody],
    (error) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(`Feedback added for ${receivedByUserSSN} given by ${givenByUserSSN}`);
    },
  );
};

// Delete a feedback
const deleteFeedback = (request, response) => {
  const feedbackSSN = parseInt(request.params.feedbackSSN, 10);

  pool.qeury("DELETE FROM Feedbacks WHERE feedbackSSN = $1", [feedbackSSN], (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Feedback deleted with feedbackSSN: ${feedbackSSN}`);
  });
};

// Updates an existing feedback
const updateFeedback = (request, response) => {
  const {
    feedbackSSN, 
    commentType,
    commentBody,
  } = request.body;

  pool.query(
    "UPDATE Feedbacks SET commentType = $1, commentBody = $2 WHERE feedbackSSN = $3",
    [commentType, commentBody, feedbackSSN],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`${feedbackSSN} has been updated`);
    },
  );
};

// View all feedbacks to a specific user
const viewAllFeedback = (request, response) => {
  const receivedByUserSSN = parseInt(request.params.receivedByUserSSN, 10);

  pool.query(
    "SELECT * FROM Feedbacks WHERE receivedByUserSSN = $1",
    [receivedByUserSSN],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// View all of the user's good feedbacks
const viewGoodFeedbacks = (request, response) => {
  const receivedByUserSSN = parseInt(request.params.receivedByUserSSN, 10);

  pool.query(
    "SELECT * FROM Feedbacks WHERE receivedByUserSSN = $1 AND commentType = GOOD",
    [receivedByUserSSN],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// View all of the user's bad feedbacks
const viewBadFeedbacks = (request, response) => {
  const receivedByUserSSN = parseInt(request.params.receivedByUserSSN, 10);

  pool.query(
    "SELECT * FROM Feedbacks WHERE receivedByUserSSN = $1 AND commentType = BAD",
    [receivedByUserSSN],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// View all transactions status of all items he/she has borrowed
const viewAllTransactionStatus = (request, response) => {
  const borrowerSSN = parseInt(request.params.borrowerSSN, 10);

  pool.query(
    "SELECT B.itemSSN, T.returnedStatus FROM Borrows B NATURAL JOIN Transactions T WHERE borrowerSSN = $1",
    [borrowerSSN],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// View the most borrowed item and its user
const viewMostBorrowedItem = (request, response) => {
  pool.query(
    "SELECT itemSSN, COUNT(*) as numOfTimesBorrowed FROM Borrows GROUP BY itemSSN ORDER BY numOfTimesBorrowed desc",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// View most expensive min bid price of an item
const viewMostExpensiveMinBid = (request, response) => {
  pool.query(
    "SELECT itemSSN, minBidPrice FROM Items ORDER BY minBidPrice desc",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// View most active borrower
const viewMostActiveBorrower = (request, response) => {
  pool.query(
    "SELECT borrowerSSN, COUNT(*) as numOfTimesBorrowed FROM Borrows GROUP BY borrowerSSN ORDER BY numOfTimesBorrowed desc",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// View user with most number of positive feedback
const viewMostPositiveUser = (request, response) => {
  pool.query(
    "SELECT receivedByUserSSN, COUNT(*) as numOfTimesPraised FROM Feedbacks WHERE typee = GOOD GROUP BY receivedByUserSSN ORDER BY numOfTimesPraised desc",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// Change loan status of item when item has been returned
const returnedItem = (request, response) => {
  const transactionSSN = parseInt(request.params.transactionSSN, 10);

  pool.query(
    "UPDATE Transactions SET returnedStatus = TRUE WHERE transactionSSN = $1",
    [transactionSSN],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Transaction with transactionSSN ${transactionSSN} updated`);
    },
  );
};

// Create a new bid
const createBid = (request, response) => {
  const {
    bidSSN,
    placedBySSN,
    itemSSN,
    bidAmt,
    dateTime,
  } = request.body;

  pool.query(
    "INSERT INTO Bids (bidSSN, placedBySSN, itemSSN, bidAmt, dateTime) VALUES ($1, $2, $3, $4, $5)",
    [bidSSN, placedBySSN, itemSSN, bidAmt, dateTime],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Bid for ${itemSSN} placed with bidSSN: ${bidSSN}`);
    },
  );
};

// Delete an existing bid
const deleteBid = (request, response) => {
  const bidSSN = parseInt(request.params.bidSSN, 10);

  pool.query(
    "DELETE FROM Bids WHERE bidSSN = $1", [bidSSN], (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`${bidSSN} successfully deleted`);
    },
  );
};

// Update an existing bid
// Need to edit to add in more fields
const updateBid = (request, response) => {
  const {
    bidSSN, bidAmt
  } = request.body;

  pool.query(
    "UPDATE Bid SET bidAmt = ${bidAmt} WHERE bidSSN = ${bidSSN}",
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Bid with bidSSN ${bidSSN} updated to new amount of ${bidAmt}`);
    },
  );
};

// View all bids of an item
const viewAllItemBid = (request, response) => {
  const itemSSN = parseInt(request.params.itemSSN);

  pool.query(
    "SELECT * FROM Bids WHERE itemSSN = $1", [itemSSN],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// View all my bids that I have placed
const viewAllMyBid = (request, response) => {
  const placedBySSN = parseInt(request.params.placedBySSN);

  pool.query(
    "SELECT * FROM Bids WHERE placedBySSN = $1", [placedBySSN],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// View winning bid of an item
const viewWinningBid = (request, response) => {
  const itemSSN = parseInt(request.params.itemSSN);

  pool.query(
    "SELECT * FROM WinningBids WHERE itemSSN = $1", [itemSSN],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

// Create a new payment once payment has been made
const createPayment = (request, response) => {
  const {
    paymentSSN,
    paymentType,
    paymentAmount,
    madeByUserSSN,
    receivedByUserSSN,
  } = request.body;

  pool.query(
    "INSERT INTO Payments (paymentSSN, paymentType, paymentAmount, madeByUserSSN, receivedByUserSSN,) VALUES ($1, $2, $3, $4, $5)",
    [paymentSSN, paymentType, paymentAmount, madeByUserSSN, receivedByUserSSN],
    (error) => {
      if (error) {
        throw.error;
      }
      response.status(200).send(`Payment made by ${madeByUserSSN} to ${receivedByUserSSN} is complete`);
    },
  );
};


module.exports = {
  createUser,
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
  viewAllBidOfItem,
  viewAllMyBid,
};

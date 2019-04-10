const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Loaner wants to check all transactions for all his items
const transactionViewAllLoaned = (request, response) => {
  const loanerSSN = parseInt(request.params.loanerSSN, 10);

  const query = 'SELECT U.username, B.itemSSN, T.returnedStatus, I.name, I.description FROM ((Borrows B INNER JOIN Transactions T ON B.transactionssn = T.transactionssn) INNER JOIN Items I ON B.itemssn = I.itemssn) INNER JOIN Users U ON B.borrowerssn = U.userssn WHERE B.itemSSN IN (SELECT itemSSN FROM Items WHERE loanedBySSN = $1)';
  const values = [loanerSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// View all transactions status of all items he/she has borrowed
const transactionViewAllBorrowed = (request, response) => {
  const borrowerSSN = parseInt(request.params.borrowerSSN, 10);

  const query = 'SELECT U.username, B.itemSSN, T.returnedStatus, I.name, I.description FROM ((Borrows B NATURAL JOIN Transactions T) INNER JOIN Items I ON B.itemssn = I.itemssn) INNER JOIN Users U ON I.loanedbyssn = U.userssn WHERE B.borrowerSSN = $1';
  const values = [borrowerSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
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
      response.send({ message: errorWinningBids.message });
    } else {
      const queryPayment = 'INSERT INTO Payments (paymentType, paidStatus, paymentAmount, madeByUserSSN, receivedByUserSSN) VALUES ($1, FALSE, $2, $3, $4) RETURNING *';
      const valuesPayment = ['AUTOMATIC', bidamt, placedbyssn, userssn];

      pool.query(queryPayment, valuesPayment, (errorPayments, resultsPayments) => {
        if (errorPayments) {
          response.send({ message: errorPayments.message });
        } else {
          const { paymentssn } = resultsPayments.rows[0];

          const queryTransactions = 'INSERT INTO Transactions (itemSSN, paymentSSN, returnedStatus) VALUES ($1, $2, FALSE)';
          const valuesTransactions = [itemssn, paymentssn];

          pool.query(queryTransactions, valuesTransactions, (errorTransactions) => {
            if (errorTransactions) {
              response.send({ message: errorTransactions.message });
            } else {
              response.send(true);
            }
          });
        }
      });
    }
  });
};

// Update a payment to pay
const paymentUpdateToPaid = (request, response) => {
  const { paymentssn } = request.body;

  const query = 'UPDATE Payments SET paidstatus = TRUE WHERE paymentssn = $1';
  const values = [paymentssn];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

const paymentDelete = (request, response) => {
  const paymentssn = parseInt(request.params.paymentSSN, 10);

  const query = 'DELETE FROM Payments WHERE paymentssn = $1';
  const values = [paymentssn];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

// Creates new item
const itemCreate = (request, response) => {
  const {
    userssn, name, description, minbidprice, loandurationindays,
  } = request.body;

  const query = 'INSERT INTO Items (loanedbyssn, name, description, minbidprice, loandurationindays) VALUES ($1, $2, $3, $4, $5)';
  const values = [userssn, name, description, minbidprice, loandurationindays];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: 'User not created' });
    } else {
      response.send(true);
    }
  });
};

// Views attributes of an item
const itemView = (request, response) => {
  const itemSSN = parseInt(request.params.itemSSN, 10);

  const select = 'SELECT I.itemssn, I.loanedbyssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM Items I INNER JOIN Users U ON I.loanedbyssn = U.userssn ';
  const where = 'WHERE itemSSN = $1';
  const values = [itemSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows[0]);
    }
  });
};

// Updates an existing item
const itemUpdate = (request, response) => {
  const {
    itemssn, userssn, name, description, minbidprice, loandurationindays,
  } = request.body;

  const query = 'UPDATE Items SET loanedBySSN = $1, name = $2, description = $3, minBidPrice = $4, loanDurationInDays = $5 WHERE itemSSN = $6';
  const values = [userssn, name, description, minbidprice, loandurationindays, itemssn];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

// Change loan status of item when item has been returned
const itemReturn = (request, response) => {
  const transactionSSN = parseInt(request.params.transactionSSN, 10);

  const query = 'UPDATE Transactions SET returnedStatus = TRUE WHERE transactionSSN = $1';
  const values = [transactionSSN];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

// Deletes an exisiting item
const itemDelete = (request, response) => {
  const itemSSN = parseInt(request.params.itemSSN, 10);

  const query = 'DELETE FROM Items WHERE itemSSN = $1';
  const values = [itemSSN];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

const viewAllExceptWith = (request, response) => {
  const loanedBySSN = parseInt(request.params.loanedBySSN, 10);
  const { searchQuery } = request.params;

  const select = 'SELECT DISTINCT I.itemssn, I.loanedbyssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM (Items I INNER JOIN Users U ON I.loanedBySSN = U.userSSN) LEFT OUTER JOIN Transactions T ON I.itemSSN = T.itemSSN ';
  const where = "WHERE I.loanedBySSN <> $1 AND T.transactionSSN IS NULL AND CONCAT(I.name, ' ', I.description) LIKE $2";
  const values = [loanedBySSN, `%${searchQuery}%`];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// View all available items except mine
const viewAllExcept = (request, response) => {
  const loanedBySSN = parseInt(request.params.loanedBySSN, 10);

  const select = 'SELECT DISTINCT I.itemssn, I.loanedbyssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM (Items I INNER JOIN Users U ON I.loanedBySSN = U.userSSN) LEFT OUTER JOIN Transactions T ON I.itemSSN = T.itemSSN ';
  const where = 'WHERE I.loanedBySSN <> $1 AND T.transactionSSN IS NULL';
  const values = [loanedBySSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// Loaner wants to search for items that are not loaned yet
const viewAllLoanedNot = (request, response) => {
  const loanedBySSN = parseInt(request.params.loanedBySSN, 10);

  const select = 'SELECT DISTINCT I.itemssn, I.loanedbyssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM (Items I INNER JOIN Users U ON I.loanedBySSN = U.userSSN) LEFT OUTER JOIN Transactions T ON I.itemSSN = T.itemSSN ';
  const where = 'WHERE I.loanedBySSN = $1 AND T.transactionSSN IS NULL';
  const values = [loanedBySSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// Borrower wants to view all items that are currently borrowed by him/her
const viewAllBorrowing = (request, response) => {
  const borrowerSSN = parseInt(request.params.borrowerSSN, 10);

  const select = 'SELECT B.itemssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username, T.transactionssn, T.enddate ';
  const from = 'FROM (((Borrows B INNER JOIN Items I ON B.itemssn = I.itemssn) INNER JOIN Users U ON I.loanedbyssn = U.userssn) INNER JOIN Transactions T ON T.transactionSSN = B.transactionSSN) ';
  const where = 'WHERE T.returnedStatus = FALSE AND B.borrowerSSN = $1';
  const values = [borrowerSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// View all your items that are currently lent out
const viewAllLoaned = (request, response) => {
  const loanedBySSN = parseInt(request.params.loanedBySSN, 10);

  const select = 'SELECT I.itemssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username, T.enddate ';
  const from = 'FROM ((Items I INNER JOIN Transactions T ON I.itemSSN = T.itemSSN) INNER JOIN Payments P ON P.paymentssn = T.paymentssn) INNER JOIN Users U ON P.madeByUserSSN = U.userssn ';
  const where = 'WHERE I.loanedBySSN = $1 AND T.returnedStatus = FALSE AND P.paidStatus = TRUE';
  const values = [loanedBySSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

const viewAllAccepted = (request, response) => {
  const userSSN = parseInt(request.params.userSSN, 10);

  const select = 'SELECT I.itemssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username, P.paymentssn, T.transactionssn, B.bidamt ';
  const from = 'FROM ((((Items I INNER JOIN WinningBids W ON I.itemssn = W.itemssn) INNER JOIN Bids B ON W.bidssn = B.bidssn) INNER JOIN Users U ON I.loanedbyssn = U.userssn) INNER JOIN Transactions T ON I.itemssn = T.itemssn) INNER JOIN Payments P ON T.paymentssn = P.paymentssn ';
  const where = 'WHERE P.madebyuserssn = $1 AND P.paidstatus = false';
  const values = [userSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

const viewAllWaiting = (request, response) => {
  const loanedBySSN = parseInt(request.params.loanedBySSN, 10);

  const select = 'SELECT I.itemssn, I.loanedbyssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username, B.bidamt ';
  const from = 'FROM ((((Items I INNER JOIN Users U ON I.loanedBySSN = U.userSSN) INNER JOIN WinningBids W ON I.itemssn = W.itemssn) INNER JOIN Bids B ON W.bidssn = B.bidssn) INNER JOIN Transactions T ON I.itemSSN = T.itemSSN) INNER JOIN Payments P ON T.paymentssn = P.paymentssn ';
  const where = 'WHERE P.receivedByUserSSN = $1 AND P.paidstatus = false';
  const values = [loanedBySSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// Create a new bid
const bidCreate = (request, response) => {
  const { userssn, itemssn, bidamt } = request.body;

  const query = 'INSERT INTO Bids (placedBySSN, itemSSN, bidAmt, bidDateTime) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)';
  const values = [userssn, itemssn, bidamt];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

// View all bids of an item
const bidViewAllItem = (request, response) => {
  const itemSSN = parseInt(request.params.itemSSN, 10);

  const select = 'SELECT B1.bidSSN, B1.placedBySSN, B1.itemSSN, B1.bidAmt, B1.bidDateTime, U.username ';
  const from = 'FROM Bids B1 INNER JOIN Users U ON B1.placedBySSN = U.userSSN ';
  const where = 'WHERE B1.itemSSN = $1 AND (B1.bidDateTime >= all (SELECT B2.bidDateTime FROM Bids B2 WHERE B2.placedBySSN = B1.placedBySSN AND B2.itemSSN = B1.itemSSN))';
  const values = [itemSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// View all my bids that I have placed that has not been accepted as a winning bid
const bidViewAllUser = (request, response) => {
  const placedBySSN = parseInt(request.params.placedBySSN, 10);

  const select = 'SELECT B1.bidssn, B1.bidamt, B1.biddatetime, I.itemssn, I.name, I.description, I.minbidprice, U.username ';
  const from = 'FROM ((Bids B1 INNER JOIN Items I ON B1.itemssn = I.itemssn) INNER JOIN Users U ON I.loanedbyssn = U.userssn) LEFT OUTER JOIN Transactions T ON I.itemssn = T.itemssn ';
  const where = 'WHERE B1.placedbyssn = $1 AND (B1.biddatetime >= ALL (SELECT B2.biddatetime FROM Bids B2 WHERE B2.placedbyssn = B1.placedbyssn AND B2.itemssn = B1.itemssn)) ';
  const and = 'AND T.transactionssn IS NULL';
  const values = [placedBySSN];

  const query = select + from + where + and;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// Delete an existing bid
const bidDelete = (request, response) => {
  const { itemssn, userssn } = request.body;

  const query = 'DELETE FROM Bids WHERE itemSSN = $1 AND placedBySSN = $2';
  const values = [itemssn, userssn];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

const userRegister = (request, response) => {
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
  } = request.body;

  bcrypt.hash(password, 12, (errorHash, hash) => {
    if (errorHash) {
      response.send({ errorMessage: 'Password cannot be empty' });
    } else {
      const query = 'INSERT INTO users (username, password, name, age, email, dob, phonenum, address, nationality) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const values = [username, hash, name, age, email, dob, phonenum, address, nationality];

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
const userUpdate = (request, response) => {
  const {
    name, age, email, dob, phonenum, address, nationality, userssn,
  } = request.body;

  const query = 'UPDATE Users SET name = $1, age = $2, email = $3, dob = $4, phoneNum = $5, address = $6, nationality = $7 WHERE userssn = $8';
  const values = [name, age, email, dob, phonenum, address, nationality, userssn];
  pool.query(query, values, (errorQuery) => {
    if (errorQuery) {
      response.send({ message: errorQuery.message });
    } else {
      response.send(true);
    }
  });
};

// Updates an exisiting user
const userUpdatePassword = (request, response) => {
  const { password, userssn } = request.body;

  bcrypt.hash(password, 12, (errorHash, hash) => {
    if (errorHash) {
      response.send({ errorMessage: 'Password cannot be empty' });
    } else {
      const query = 'UPDATE Users SET password = $1 WHERE userssn = $2';
      const values = [hash, userssn];
      pool.query(query, values, (errorQuery) => {
        if (errorQuery) {
          response.send({ message: errorQuery.message });
        } else {
          response.send(true);
        }
      });
    }
  });
};

// Deletes an exisiting user
const userDelete = (request, response) => {
  request.logOut();

  const userSSN = parseInt(request.params.userSSN, 10);

  const query = 'DELETE FROM Users WHERE userSSN = $1';
  const values = [userSSN];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

const userDetail = (request, response) => {
  const userSSN = parseInt(request.params.userSSN, 10);

  const query = 'SELECT userssn, username, name, age, email, dob, phonenum, address, nationality FROM users WHERE userssn = $1';
  const values = [userSSN];

  pool.query(query, values, (errorQuery, resultQuery) => {
    if (errorQuery) {
      response.send(errorQuery);
    } else {
      response.send(resultQuery.rows[0]);
    }
  });
};

const userAllExcept = (request, response) => {
  const userSSN = parseInt(request.params.userSSN, 10);

  const query = 'SELECT userssn, username, name FROM Users WHERE userssn <> $1';
  const values = [userSSN];

  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// View most active borrower
const userSearchMostActive = (request, response) => {
  const query = 'SELECT U.username, COUNT(*) as numOfTimesBorrowed FROM Borrows B INNER JOIN Users U ON B.borrowerssn = U.userssn GROUP BY U.username ORDER BY numOfTimesBorrowed DESC';

  pool.query(query, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// View user with most number of positive feedback
const userSearchMostPositive = (request, response) => {
  const query = "SELECT U.username, COUNT(*) as numOfTimesPraised FROM Feedbacks F INNER JOIN Users U ON F.receivedByUserSSN = U.userssn WHERE commentType = 'Good' GROUP BY U.username ORDER BY numOfTimesPraised DESC";

  pool.query(query, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

const userSearchMostPopular = (request, response) => {
  const query = 'SELECT U.username, COUNT(*) as numOfTimesLoaned FROM Borrows B INNER JOIN (Items I INNER JOIN Users U ON I.loanedbyssn = U.userssn) ON B.itemssn = I.itemssn GROUP BY U.username ORDER BY numOfTimesLoaned DESC';

  pool.query(query, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// Create a feedback
const feedbackCreate = (request, response) => {
  const {
    userssn, receivedbyuserssn, commenttype, commentbody,
  } = request.body;

  const query = 'INSERT INTO Feedbacks (givenByUserSSN, receivedByUserSSN, commentType, commentBody) VALUES ($1, $2, $3, $4)';
  const values = [userssn, receivedbyuserssn, commenttype, commentbody];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

// Updates an existing feedback
const feedbackUpdate = (request, response) => {
  const { commenttype, commentbody, feedbackssn } = request.body;

  const query = 'UPDATE Feedbacks SET commentType = $1, commentBody = $2 WHERE feedbackSSN = $3';
  const values = [commenttype, commentbody, feedbackssn];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

// Delete a feedback
const feedbackDelete = (request, response) => {
  const feedbackSSN = parseInt(request.params.feedbackSSN, 10);

  const query = 'DELETE FROM Feedbacks WHERE feedbackSSN = $1';
  const values = [feedbackSSN];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

// View all feedbacks to a specific user
const feedbackViewAll = (request, response) => {
  const receivedByUserSSN = parseInt(request.params.receivedByUserSSN, 10);

  const select = 'SELECT F.feedbackSSN, F.givenByUserSSN, F.commenttype, F.commentbody, U.username ';
  const from = 'FROM Feedbacks F INNER JOIN Users U ON F.givenbyuserssn = U.userssn ';
  const where = 'WHERE receivedByUserSSN = $1';
  const values = [receivedByUserSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

// View all feedbacks to a specific user
const feedbackViewAllGiven = (request, response) => {
  const givenByUserSSN = parseInt(request.params.givenByUserSSN, 10);

  const select = 'SELECT F.feedbackSSN, F.receivedByUserSSN, F.commenttype, F.commentbody, U.username ';
  const from = 'FROM Feedbacks F INNER JOIN Users U ON F.receivedByUserSSN = U.userssn ';
  const where = 'WHERE givenByUserSSN = $1';
  const values = [givenByUserSSN];

  const query = select + from + where;
  pool.query(query, values, (error, results) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(results.rows);
    }
  });
};

module.exports = {
  transactionViewAllLoaned,
  transactionViewAllBorrowed,
  acceptWinningBid,
  paymentUpdateToPaid,
  paymentDelete,
  itemCreate,
  itemView,
  itemUpdate,
  itemReturn,
  itemDelete,
  viewAllExceptWith,
  viewAllExcept,
  viewAllLoanedNot,
  viewAllBorrowing,
  viewAllLoaned,
  viewAllAccepted,
  viewAllWaiting,
  bidCreate,
  bidViewAllItem,
  bidViewAllUser,
  bidDelete,
  userRegister,
  userUpdate,
  userUpdatePassword,
  userDelete,
  userDetail,
  userAllExcept,
  userSearchMostActive,
  userSearchMostPositive,
  userSearchMostPopular,
  feedbackCreate,
  feedbackUpdate,
  feedbackDelete,
  feedbackViewAll,
  feedbackViewAllGiven,
};

const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Loaner wants to check all transactions for all his items
const transactionViewAllLoaned = (request, response) => {
  const loanerssn = parseInt(request.params.loanerssn, 10);

  const query = 'SELECT U.username, B.itemssn, T.returnedstatus, I.name, I.description FROM ((Borrows B INNER JOIN Transactions T ON B.transactionssn = T.transactionssn) INNER JOIN Items I ON B.itemssn = I.itemssn) INNER JOIN Users U ON B.borrowerssn = U.userssn WHERE B.itemssn IN (SELECT itemssn FROM Items WHERE loanedbyssn = $1)';
  const values = [loanerssn];

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
  const borrowerssn = parseInt(request.params.borrowerssn, 10);

  const query = 'SELECT U.username, B.itemssn, T.returnedstatus, I.name, I.description FROM ((Borrows B NATURAL JOIN Transactions T) INNER JOIN Items I ON B.itemssn = I.itemssn) INNER JOIN Users U ON I.loanedbyssn = U.userssn WHERE B.borrowerssn = $1';
  const values = [borrowerssn];

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

  const queryWinningBid = 'INSERT INTO WinningBids (bidssn, itemssn) VALUES ($1, $2)';
  const valuesWinningBid = [bidssn, itemssn];

  pool.query(queryWinningBid, valuesWinningBid, (errorWinningBids) => {
    if (errorWinningBids) {
      response.send({ errorMessage: errorWinningBids.message });
    } else {
      const queryPayment = 'INSERT INTO Payments (paymenttype, paidstatus, paymentamount, madebyuserssn, receivedbyuserssn) VALUES ($1, FALSE, $2, $3, $4) RETURNING *';
      const valuesPayment = ['AUTOMATIC', bidamt, placedbyssn, userssn];

      pool.query(queryPayment, valuesPayment, (errorPayments, resultsPayments) => {
        if (errorPayments) {
          response.send({ errorMessage: errorPayments.message });
        } else {
          const { paymentssn } = resultsPayments.rows[0];

          const queryTransactions = 'INSERT INTO Transactions (itemssn, paymentssn, returnedstatus) VALUES ($1, $2, FALSE)';
          const valuesTransactions = [itemssn, paymentssn];

          pool.query(queryTransactions, valuesTransactions, (errorTransactions) => {
            if (errorTransactions) {
              response.send({ errorMessage: errorTransactions.message });
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
  const paymentssn = parseInt(request.params.paymentssn, 10);

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
      if (
        error.message.includes('items_name_check')
        || error.message.includes('null value in column "name"')
      ) {
        response.send({ errorMessage: 'Item name cannot be empty' });
      } else if (
        error.message.includes('items_description_check')
        || error.message.includes('null value in column "description"')
      ) {
        response.send({ errorMessage: 'Description cannot be empty' });
      } else if (error.message.includes('null value in column "minbidprice"')) {
        response.send({ errorMessage: 'Minimum bid price cannot be empty' });
      } else if (error.message.includes('null value in column "loandurationindays"')) {
        response.send({ errorMessage: 'Loan duration in days cannot be empty' });
      } else if (error.message.includes('items_minbidprice_check')) {
        response.send({ errorMessage: 'Minimum bid price cannot be negative' });
      } else if (error.message.includes('items_loandurationindays_check')) {
        response.send({ errorMessage: 'Loan duration cannot be negative' });
      } else {
        response.send({ errorMessage: error.message });
      }
    } else {
      response.send(true);
    }
  });
};

// Views attributes of an item
const itemView = (request, response) => {
  const itemssn = parseInt(request.params.itemssn, 10);

  const select = 'SELECT I.itemssn, I.loanedbyssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM Items I INNER JOIN Users U ON I.loanedbyssn = U.userssn ';
  const where = 'WHERE itemssn = $1';
  const values = [itemssn];

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
    name, description, minbidprice, loandurationindays, itemssn,
  } = request.body;

  const query = 'UPDATE Items SET name = $1, description = $2, minbidprice = $3, loandurationindays = $4 WHERE itemssn = $5';
  const values = [name, description, minbidprice, loandurationindays, itemssn];

  pool.query(query, values, (error) => {
    if (error) {
      if (
        error.message.includes('items_name_check')
        || error.message.includes('null value in column "name"')
      ) {
        response.send({ errorMessage: 'Item name cannot be empty' });
      } else if (
        error.message.includes('items_description_check')
        || error.message.includes('null value in column "description"')
      ) {
        response.send({ errorMessage: 'Description cannot be empty' });
      } else if (error.message.includes('null value in column "minbidprice"')) {
        response.send({ errorMessage: 'Minimum bid price cannot be empty' });
      } else if (error.message.includes('null value in column "loandurationindays"')) {
        response.send({ errorMessage: 'Loan duration in days cannot be empty' });
      } else if (error.message.includes('items_minbidprice_check')) {
        response.send({ errorMessage: 'Minimum bid price cannot be negative' });
      } else if (error.message.includes('items_loandurationindays_check')) {
        response.send({ errorMessage: 'Loan duration cannot be negative' });
      } else {
        response.send({ errorMessage: error.message });
      }
    } else {
      response.send(true);
    }
  });
};

// Change loan status of item when item has been returned
const itemReturn = (request, response) => {
  const transactionssn = parseInt(request.params.transactionssn, 10);

  const query = 'UPDATE Transactions SET returnedstatus = TRUE WHERE transactionssn = $1';
  const values = [transactionssn];

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
  const itemssn = parseInt(request.params.itemssn, 10);

  const query = 'DELETE FROM Items WHERE itemssn = $1';
  const values = [itemssn];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

const viewAllExceptWith = (request, response) => {
  const loanedbyssn = parseInt(request.params.loanedbyssn, 10);
  const { searchquery } = request.params;

  const select = 'SELECT DISTINCT I.itemssn, I.loanedbyssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM (Items I INNER JOIN Users U ON I.loanedbyssn = U.userssn) LEFT OUTER JOIN Transactions T ON I.itemssn = T.itemssn ';
  const where = "WHERE I.loanedbyssn <> $1 AND T.transactionssn IS NULL AND CONCAT(I.name, ' ', I.description) LIKE $2";
  const values = [loanedbyssn, `%${searchquery}%`];

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
  const loanedbyssn = parseInt(request.params.loanedbyssn, 10);

  const select = 'SELECT DISTINCT I.itemssn, I.loanedbyssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM (Items I INNER JOIN Users U ON I.loanedbyssn = U.userssn) LEFT OUTER JOIN Transactions T ON I.itemssn = T.itemssn ';
  const where = 'WHERE I.loanedbyssn <> $1 AND T.transactionssn IS NULL';
  const values = [loanedbyssn];

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
  const loanedbyssn = parseInt(request.params.loanedbyssn, 10);

  const select = 'SELECT DISTINCT I.itemssn, I.loanedbyssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username ';
  const from = 'FROM (Items I INNER JOIN Users U ON I.loanedbyssn = U.userssn) LEFT OUTER JOIN Transactions T ON I.itemssn = T.itemssn ';
  const where = 'WHERE I.loanedbyssn = $1 AND T.transactionssn IS NULL';
  const values = [loanedbyssn];

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
  const borrowerssn = parseInt(request.params.borrowerssn, 10);

  const select = 'SELECT B.itemssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username, T.transactionssn, T.enddate ';
  const from = 'FROM (((Borrows B INNER JOIN Items I ON B.itemssn = I.itemssn) INNER JOIN Users U ON I.loanedbyssn = U.userssn) INNER JOIN Transactions T ON T.transactionssn = B.transactionssn) ';
  const where = 'WHERE T.returnedstatus = FALSE AND B.borrowerssn = $1';
  const values = [borrowerssn];

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
  const loanedbyssn = parseInt(request.params.loanedbyssn, 10);

  const select = 'SELECT I.itemssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username, T.enddate ';
  const from = 'FROM ((Items I INNER JOIN Transactions T ON I.itemssn = T.itemssn) INNER JOIN Payments P ON P.paymentssn = T.paymentssn) INNER JOIN Users U ON P.madebyuserssn = U.userssn ';
  const where = 'WHERE I.loanedbyssn = $1 AND T.returnedstatus = FALSE AND P.paidstatus = TRUE';
  const values = [loanedbyssn];

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
  const userssn = parseInt(request.params.userssn, 10);

  const select = 'SELECT I.itemssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username, P.paymentssn, T.transactionssn, B.bidamt ';
  const from = 'FROM ((((Items I INNER JOIN WinningBids W ON I.itemssn = W.itemssn) INNER JOIN Bids B ON W.bidssn = B.bidssn) INNER JOIN Users U ON I.loanedbyssn = U.userssn) INNER JOIN Transactions T ON I.itemssn = T.itemssn) INNER JOIN Payments P ON T.paymentssn = P.paymentssn ';
  const where = 'WHERE P.madebyuserssn = $1 AND P.paidstatus = false';
  const values = [userssn];

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
  const loanedbyssn = parseInt(request.params.loanedbyssn, 10);

  const select = 'SELECT I.itemssn, I.loanedbyssn, I.name, I.description, I.minbidprice, I.loandurationindays, U.username, B.bidamt ';
  const from = 'FROM ((((Items I INNER JOIN Users U ON I.loanedbyssn = U.userssn) INNER JOIN WinningBids W ON I.itemssn = W.itemssn) INNER JOIN Bids B ON W.bidssn = B.bidssn) INNER JOIN Transactions T ON I.itemssn = T.itemssn) INNER JOIN Payments P ON T.paymentssn = P.paymentssn ';
  const where = 'WHERE P.receivedbyuserssn = $1 AND P.paidstatus = false';
  const values = [loanedbyssn];

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

  const query = 'INSERT INTO Bids (placedbyssn, itemssn, bidamt, biddatetime) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)';
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
  const itemssn = parseInt(request.params.itemssn, 10);

  const select = 'SELECT B1.bidssn, B1.placedbyssn, B1.itemssn, B1.bidamt, B1.biddatetime, U.username ';
  const from = 'FROM Bids B1 INNER JOIN Users U ON B1.placedbyssn = U.userssn ';
  const where = 'WHERE B1.itemssn = $1 AND (B1.biddatetime >= all (SELECT B2.biddatetime FROM Bids B2 WHERE B2.placedbyssn = B1.placedbyssn AND B2.itemssn = B1.itemssn))';
  const values = [itemssn];

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
  const placedbyssn = parseInt(request.params.placedbyssn, 10);

  const select = 'SELECT B1.bidssn, B1.bidamt, B1.biddatetime, I.itemssn, I.name, I.description, I.minbidprice, U.username ';
  const from = 'FROM ((Bids B1 INNER JOIN Items I ON B1.itemssn = I.itemssn) INNER JOIN Users U ON I.loanedbyssn = U.userssn) LEFT OUTER JOIN Transactions T ON I.itemssn = T.itemssn ';
  const where = 'WHERE B1.placedbyssn = $1 AND (B1.biddatetime >= ALL (SELECT B2.biddatetime FROM Bids B2 WHERE B2.placedbyssn = B1.placedbyssn AND B2.itemssn = B1.itemssn)) ';
  const and = 'AND T.transactionssn IS NULL';
  const values = [placedbyssn];

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

  const query = 'DELETE FROM Bids WHERE itemssn = $1 AND placedbyssn = $2';
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

  if (!password || password.length === 0) {
    response.send({ errorMessage: 'Password cannot be empty' });
  } else {
    bcrypt.hash(password, 12, (errorHash, hash) => {
      if (errorHash) {
        response.send({ errorMessage: 'Password cannot be empty' });
      } else {
        const query = 'INSERT INTO users (username, password, name, age, email, dob, phonenum, address, nationality) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
        const values = [username, hash, name, age, email, dob, phonenum, address, nationality];

        pool.query(query, values, (errorQuery) => {
          if (errorQuery) {
            if (errorQuery.message.includes('users_username_key')) {
              response.send({ errorMessage: 'Username is taken' });
            } else if (errorQuery.message.includes('users_username_check')) {
              response.send({ errorMessage: 'Username cannot be empty' });
            } else {
              response.send({ errorMessage: errorQuery.message });
            }
          } else {
            response.send(true);
          }
        });
      }
    });
  }
};

// Updates an exisiting user
const userUpdate = (request, response) => {
  const {
    name, age, email, dob, phonenum, address, nationality, userssn,
  } = request.body;

  const query = 'UPDATE Users SET name = $1, age = $2, email = $3, dob = $4, phonenum = $5, address = $6, nationality = $7 WHERE userssn = $8';
  const values = [name, age, email, dob, phonenum, address, nationality, userssn];
  pool.query(query, values, (errorQuery) => {
    if (errorQuery) {
      response.send({ errorMessage: errorQuery.message });
    } else {
      response.send(true);
    }
  });
};

// Updates an exisiting user
const userUpdatePassword = (request, response) => {
  const { password, userssn } = request.body;

  if (!password || password.length === 0) {
    response.send({ errorMessage: 'Password cannot be empty' });
  } else {
    bcrypt.hash(password, 12, (errorHash, hash) => {
      if (errorHash) {
        response.send({ errorMessage: 'Password cannot be empty' });
      } else {
        const query = 'UPDATE Users SET password = $1 WHERE userssn = $2';
        const values = [hash, userssn];
        pool.query(query, values, (errorQuery) => {
          if (errorQuery) {
            response.send({ errorMessage: errorQuery.message });
          } else {
            response.send(true);
          }
        });
      }
    });
  }
};

// Deletes an exisiting user
const userDelete = (request, response) => {
  request.logOut();

  const userssn = parseInt(request.params.userssn, 10);

  const query = 'DELETE FROM Users WHERE userssn = $1';
  const values = [userssn];

  pool.query(query, values, (error) => {
    if (error) {
      response.send({ errorMessage: error.message });
    } else {
      response.send(true);
    }
  });
};

const userDetail = (request, response) => {
  const userssn = parseInt(request.params.userssn, 10);

  const query = 'SELECT userssn, username, name, age, email, dob, phonenum, address, nationality FROM users WHERE userssn = $1';
  const values = [userssn];

  pool.query(query, values, (errorQuery, resultQuery) => {
    if (errorQuery) {
      response.send({ errorMessage: errorQuery.message });
    } else {
      const keys = Object.keys(resultQuery.rows[0]);
      const filteredResult = {};

      keys.forEach((key) => {
        if (resultQuery.rows[0][key] !== null) {
          filteredResult[key] = resultQuery.rows[0][key];
        }
      });

      response.send(filteredResult);
    }
  });
};

const userAllExcept = (request, response) => {
  const userssn = parseInt(request.params.userssn, 10);

  const query = 'SELECT userssn, username, name FROM Users WHERE userssn <> $1';
  const values = [userssn];

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
  const query = "SELECT U.username, COUNT(*) as numOfTimesPraised FROM Feedbacks F INNER JOIN Users U ON F.receivedbyuserssn = U.userssn WHERE commenttype = 'Good' GROUP BY U.username ORDER BY numOfTimesPraised DESC";

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

  const query = 'INSERT INTO Feedbacks (givenbyuserssn, receivedbyuserssn, commenttype, commentbody) VALUES ($1, $2, $3, $4)';
  const values = [userssn, receivedbyuserssn, commenttype, commentbody];

  pool.query(query, values, (error) => {
    if (error) {
      if (error.message.includes('null value in column "receivedbyuserssn"')) {
        response.send({ errorMessage: 'User must be selected' });
      } else if (
        error.message.includes('feedbacks_commenttype_check')
        || error.message.includes('null value in column "commenttype"')
      ) {
        response.send({ errorMessage: 'Comment Type cannot be empty' });
      } else if (
        error.message.includes('feedbacks_commentbody_check')
        || error.message.includes('null value in column "commentbody"')
      ) {
        response.send({ errorMessage: 'Comment Body cannot be empty' });
      } else {
        response.send({ errorMessage: error.message });
      }
    } else {
      response.send(true);
    }
  });
};

// Updates an existing feedback
const feedbackUpdate = (request, response) => {
  const { commenttype, commentbody, feedbackssn } = request.body;

  const query = 'UPDATE Feedbacks SET commenttype = $1, commentbody = $2 WHERE feedbackssn = $3';
  const values = [commenttype, commentbody, feedbackssn];

  if (!feedbackssn || feedbackssn.length === 0) {
    response.send({ errorMessage: 'Feedback to be edited must be selected' });
  } else {
    pool.query(query, values, (error) => {
      if (error) {
        if (error.message.includes('null value in column "receivedbyuserssn"')) {
          response.send({ errorMessage: 'User must be selected' });
        } else if (
          error.message.includes('feedbacks_commenttype_check')
          || error.message.includes('null value in column "commenttype"')
        ) {
          response.send({ errorMessage: 'Comment Type cannot be empty' });
        } else if (
          error.message.includes('feedbacks_commentbody_check')
          || error.message.includes('null value in column "commentbody"')
        ) {
          response.send({ errorMessage: 'Comment Body cannot be empty' });
        } else {
          response.send({ errorMessage: error.message });
        }
      } else {
        response.send(true);
      }
    });
  }
};

// Delete a feedback
const feedbackDelete = (request, response) => {
  const feedbackssn = parseInt(request.params.feedbackssn, 10);

  const query = 'DELETE FROM Feedbacks WHERE feedbackssn = $1';
  const values = [feedbackssn];

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
  const receivedbyuserssn = parseInt(request.params.receivedbyuserssn, 10);

  const select = 'SELECT F.feedbackssn, F.givenbyuserssn, F.commenttype, F.commentbody, U.username ';
  const from = 'FROM Feedbacks F INNER JOIN Users U ON F.givenbyuserssn = U.userssn ';
  const where = 'WHERE receivedbyuserssn = $1';
  const values = [receivedbyuserssn];

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
  const givenbyuserssn = parseInt(request.params.givenbyuserssn, 10);

  const select = 'SELECT F.feedbackssn, F.receivedbyuserssn, F.commenttype, F.commentbody, U.username ';
  const from = 'FROM Feedbacks F INNER JOIN Users U ON F.receivedbyuserssn = U.userssn ';
  const where = 'WHERE givenbyuserssn = $1';
  const values = [givenbyuserssn];

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

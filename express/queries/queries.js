const bcrypt = require('bcrypt');

const pool = require('../config/db');

// Creates new user
// Need to think about how to generate the item SSNs
const createUser = (request, response) => {
  const {
    username,
    passwordd,
    namee,
    age,
    email,
    dob,
    contact,
    address,
    nationality,
  } = request.body;

  pool.query(
    'INSERT INTO Users (username, passwordd, namee, age, email, dob, contact, address, nationality) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [username, passwordd, namee, age, email, dob, contact, address, nationality],
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

  pool.query('DELETE FROM Users WHERE userSSN = $1', [userSSN], (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with UserSSN: ${userSSN}`);
  });
};

// Updates an exisiting user
// Can we get the SSN to update?
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
    userssn,
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
        userssn,
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
    loanedByUserSSN, name, description, minBidPrice, loanDuration,
  } = request.body;

  pool.query(
    'INSERT INTO Items (loanedbyuserssn, name, description, minbidprice, loanduration) VALUES ($1, $2, $3, $4, $5)',
    [loanedByUserSSN, name, description, minBidPrice, loanDuration],
    (error) => {
      if (error) {
        response.send({ error, message: 'User not created' });
      } else {
        response.send(`Item added with ItemSSN: ${'itemSSN'}`); // fix. UPDATE: query result is empty array
      }
    },
  );
};

// View all available items
const viewAllAvailableItems = (request, response) => {
  pool.query('SELECT * FROM Items where transactionSSN IS NULL', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Deletes an exisiting item
const deleteItem = (request, response) => {
  const itemSSN = parseInt(request.params.itemSSN, 10);

  pool.query('DELETE FROM Items WHERE itemSSN = $1', [itemSSN], (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Item deleted from the list with ItemSSN: ${itemSSN}`);
  });
};

// Loaner wants to search for all the items under User SSN
const searchAllItems = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  pool.query(`SELECT * FROM Items WHERE loanedByUserSSN = ${loanedByUserSSN}`, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// Loaner wants to search for items that are not loaned yet
const searchAvailableItems = (request, response) => {
  const loanedByUserSSN = parseInt(request.params.loanedByUserSSN, 10);

  pool.query(
    'SELECT * FROM Items WHERE loanedByUserSSN = $1 AND transactionSSN IS NULL',
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
    `SELECT I.itemSSN, B.borrowSSN FROM Items I LEFT OUTER JOIN Borrows B ON I.itemSSN = B.transactionSSN WHERE I.loanedByUserSSN = ${loanedByUserSSN}`,
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
    `SELECT itemSSN, transactionSSN FROM Borrows WHERE itemSSN IN (SELECT itemSSN FROM Items WHERE loanerSSN = ${loanerSSN}`,
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
    'INSERT INTO WinningBid (bidSSN, itemSSN) VALUES ($1, $2)',
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
    transactionSSN, startDate, endDate, itemSSN, borrowerSSN,
  } = request.body;

  pool.query(
    'INSERT INTO Transactions (transactionSSN, paidStatus, startDate, endDate, returnedStatus) VALUES ($1, TRUE, $2, $3, FALSE)',
    [transactionSSN, startDate, endDate],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Transaction added with transactionSSN: ${transactionSSN}`);
    },
  );

  pool.query(
    'INSERT INTO Borrows (itemSSN, borrowerSSN, transactionSSN) VALUES ($1, $2, $3)',
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
    feedbackSSN, givenByUserSSN, receivedByUserSSN, typee, commentt,
  } = request.body;

  pool.query(
    'INSERT INTO Feedbacks (feedbackSSN, givenByUserSSN, receivedByUserSSN, typee, commentt) VALUES ($1, $2, $3, $4, $5',
    [feedbackSSN, givenByUserSSN, receivedByUserSSN, typee, commentt],
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

  pool.qeury('DELETE FROM Feedbacks WHERE feedbackSSN = $1', feedbackSSN, (error) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Feedback deleted with feedbackSSN: ${feedbackSSN}`);
  });
};

// View all feedbacks to a specific user
// Maybe showing the username will be more beneficial
const viewAllFeedback = (request, response) => {
  const receivedByUserSSN = parseInt(request.params.receivedByUserSSN, 10);

  pool.query(
    'SELECT typee, commentt givenByUserSSN, date FROM Feedbacks WHERE receivedByUserSSN = $1 ORDER BY date desc',
    receivedByUserSSN,
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
    'SELECT B.itemSSN, T.returnedStatus FROM Borrows NATURAL JOIN Transactions WHERE borrowerSSN = $1',
    borrowerSSN,
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
    'SELECT itemSSN, COUNT(*) as numOfTimesBorrowed FROM Borrows GROUP BY itemSSN ORDER BY numOfTimesBorrowed desc',
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
    'SELECT itemSSN, minBidPrice FROM Items ORDER BY minBidPrice desc',
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
    'SELECT borrowerSSN, COUNT(*) as numOfTimesBorrowed FROM Borrows GROUP BY borrowerSSN ORDER BY numOfTimesBorrowed desc',
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
    'SELECT receivedByUserSSN, COUNT(*) as numOfTimesPraised FROM Feedbacks WHERE typee = PRAISE GROUP BY receivedByUserSSN ORDER BY numOfTimesPraised desc',
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
    'UPDATE Transactions SET returnedStatus = TRUE WHERE transactionSSN = $1',
    [transactionSSN],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Transaction with transactionSSN ${transactionSSN} updated`);
    },
  );

  pool.query(
    'UPDATE Items SET transactionSSN = NULL WHERE transactionSSN = $1',
    [transactionSSN],
    (error) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Item with transactionSSN ${transactionSSN} updated as returned`);
    },
  );
};

const createBid = (request, response) => {
  const { placedBySSN, itemSSN, bidAmt } = request.body;

  pool.query(
    'INSERT INTO Bids (placedBySSN, itemSSN, bidAmt, bidDateTime) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)',
    [placedBySSN, itemSSN, bidAmt],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User added with UserSSN: ${'results.insertUserSSN'}`);
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
  searchAllItems,
  searchAvailableItems,
  searchBorrower,
  searchTransactions,
  acceptWinningBid,
  addTransactionAndBorrows,
  createFeedback,
  deleteFeedback,
  viewAllFeedback,
  viewAllTransactionStatus,
  viewMostBorrowedItem,
  viewMostExpensiveMinBid,
  viewMostActiveBorrower,
  viewMostPositiveUser,
  returnedItem,
  createBid,
};

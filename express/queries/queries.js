const pool = require('../config/db.js')

// Creates new user
// Need to think about how to generate the item SSNs
const createUser = (request, response) => {
    const {username, passwordd, namee, age, email, dob, contact, address, nationality} = request.body

    pool.query(
        'INSERT INTO Users (username, passwordd, namee, age, email, dob, contact, address, nationality) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [username, passwordd, namee, age, email, dob, contact, address, nationality], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User added with UserSSN: ${results.insertUserSSN}`)
    })
}

// Deletes an exisiting user
const deleteUser = (request, response) => {
    const userSSN = parseInt(request.params.userSSN)

    pool.query('DELETE FROM Users WHERE userSSN = $1', [userSSN], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with UserSSN: ${userSSN}`)
    })
}

// Updates an exisiting user
// Can we get the SSN to update?
const updateUser = (request, response) => {
    const userSSN = parseInt(request.params.userSSN)
    const {username, passwordd, namee, age, email, dob, contact, address, nationality} = request.body

    pool.query(
        `UPDATE Users SET username = $1, passwordd = $2, namee = $3, age = $4, email = $5, dob = $6, contact = $7, address = $8, nationality = $9 WHERE UserSSN = $10`,
        [username, passwordd, namee, age, email, dob, contact, address, nationality, userSSN],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with UserSSN: ${userSSN}`)
        })
}

// Creates new item
const createItem = (request, response) => {
    const {loanedByUserSSN, namee, description, minBidPrice, loanDuration} = request.body

    pool.query(
        'INSERT INTO Items (transactionSSN, loanedByUserSSN, namee, description, minBidPrice, loanDuration) VALUES (NULL, $1, $2, $3, $4, $5)',
        [loanedByUserSSN, namee, description, minBidPrice, loanDuration], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Item added with ItemSSN: ${itemSSN}`)
    })
} 

// Deletes an exisiting item
const deleteItem = (request, response) => {
    const itemSSN = parseInt(request.params.itemSSN)

    pool.query(
        'DELETE FROM Items WHERE itemSSN = $1', [itemSSN], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Item deleted from the list with ItemSSN: ${itemSSN}`)
        })
}

// Updates an exisiting item to be on loan
const loanedItem = (request, response) => {
    const itemSSN = parseInt(request.params.itemSSN)

    pool.query(
        `UPDATE Items SET transactionSSN = NULL where itemSSN = $1`, [itemSSN],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Item with ItemSSN: ${itemSSN} is on loan`)
        })
}

// Loaner wants to search for all the items under User SSN
const searchAllItems = (request, response) => {
    const loanedByUserSSN = parseInt(request.params.loanedByUserSSN)

    pool.query(
        `SELECT * FROM Items WHERE loanedByUserSSN = ${loanedByUserSSN}`, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
}

// Loaner wants to search for items that are not loaned yet
const searchAvailableItems = (request, response) => {
    const loanedByUserSSN = parseInt(request.params.loanedByUserSSN)

    pool.query(
        `SELECT * FROM Items WHERE loanedByUserSSN = ${loanedByUserSSN} AND transactionSSN IS NOT NULL`, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
}

// Loaner wants to find all current borrowers of his/her item
const searchBorrower = (request, response) => {
    const loanedByUserSSN = parseInt(request.params.loanedByUserSSN)

    pool.query(
        `SELECT I.itemSSN, B.borrowSSN FROM Items I LEFT OUTER JOIN Borrows B ON I.itemSSN = B.transactionSSN WHERE I.loanedByUserSSN = ${loanedByUserSSN}`,
         (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
}

// Loaner wants to check all transactions for all his items
const searchTransactions = (request, response) => {
    const loanerSSN = parseInt(request.params.loanerSSN)

    pool.query(
        `SELECT itemSSN, transactionSSN FROM Borrows WHERE itemSSN IN (SELECT itemSSN FROM Items WHERE loanerSSN = ${loanerSSN}`,
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
}

// Accept winning bid
const acceptWinningBid = (request, response) => {
    const {bidSSN, itemSSN} = request.body
    
    pool.query(
        `INSERT INTO WinningBid (bidSSN, itemSSN) VALUES ($1, $2)`, [bidSSN, itemSSN], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Winning bid of item with SSN: ${itemSSN} with bid ${bidSSN}`)
        })
}

// Create an new transaction and borrows upon accepting a winning bid\
const addTransactionAndBorrows = (request, response) => {
    const {transactionSSN, startDate, endDate, itemSSN, borrowerSSN} = request.body

    pool.query(
        `INSERT INTO Transactions (transactionSSN, paidStatus, startDate, endDate, returnedStatus) VALUES ($1, TRUE, $2, $3, FALSE)`, [transactionSSN, startDate, endDate],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Transaction added with transactionSSN: ${transactionSSN}`)
        })

    pool.query(
        `INSERT INTO Borrows (itemSSN, borrowerSSN, transactionSSN) VALUES ($1, $2, $3)`, [itemSSN, borrowerSSN, transactionSSN],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Borrow record added for item: ${itemSSN}, borrower: ${borrowerSSN} with transaction: ${transactionSSN}`)
        })
}

// Create a feedback
const createFeedback = (request, response) => {
    const {feedbackSSN, givenByUserSSN, receivedByUserSSN, typee, commentt} = request.body
    
    pool.query(
        `INSERT INTO Feedbacks (feedbackSSN, givenByUserSSN, receivedByUserSSN, typee, commentt) VALUES ($1, $2, $3, $4, $5`,
        [feedbackSSN, givenByUserSSN, receivedByUserSSN, typee, commentt], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Feedback added for ${receivedByUserSSN} given by ${givenByUserSSN}`)
        })
}

// Delete a feedback
const deleteFeedback = (request, response) => {
    const feedbackSSN = parseInt(request.params.feedbackSSN)

    pool.qeury(
        `DELETE FROM Feedbacks WHERE feedbackSSN = $1`, feedbackSSN, (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Feedback deleted with feedbackSSN: ${feedbackSSN}`)
        })
}

// View all feedbacks to a specific user
// Maybe showing the username will be more beneficial
const viewAllFeedback = (request, response) => {
    const receivedByUserSSN = parseInt(request.params.receivedByUserSSN)

    pool.query(
        `SELECT typee, commentt givenByUserSSN, date FROM Feedbacks WHERE receivedByUserSSN = $1 ORDER BY date desc`, receivedByUserSSN,
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
}

// View all transactions status of all items he/she has borrowed
const viewAllTransactionStatus = (request, response) => {
    const borrowerSSN = parseInt(request.params.borrowerSSN)

    pool.query(
        `SELECT B.itemSSN, T.returnedStatus FROM Borrows NATURAL JOIN Transactions WHERE borrowerSSN = $1`, borrowerSSN,
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
}

// View the most borrowed item and its user
const viewMostBorrowedItem = (request, response) => {
    pool.query(
        'SELECT itemSSN, COUNT(*) as numOfTimesBorrowed FROM Borrows GROUP BY itemSSN ORDER BY numOfTimesBorrowed desc',
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
}

// View most expensive min bid price of an item
const viewMostExpensiveMinBid = (request, response) => {
    pool.query(
        'SELECT itemSSN, minBidPrice FROM Items ORDER BY minBidPrice desc', (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
}

// View most active borrower
const viewMostActiveBorrower = (request, response) => {
    pool.query(
        'SELECT borrowerSSN, COUNT(*) as numOfTimesBorrowed FROM Borrows GROUP BY borrowerSSN ORDER BY numOfTimesBorrowed desc',
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
}

// View user with most number of positive feedback
const viewMostPositiveUser = (request, reponse) => {
    pool.query(
        'SELECT receivedByUserSSN, COUNT(*) as numOfTimesPraised FROM Feedbacks WHERE typee = PRAISE GROUP BY receivedByUserSSN ORDER BY numOfTimesPraised desc',
    (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

// Change loan status of item when item has been returned
const returnedItem = (request, response) => {
    const transactionSSN = parseInt(request.params.transactionSSN)

    pool.query(
        'UPDATE Transactions SET returnedStatus = TRUE WHERE transactionSSN = $1', [transactionSSN],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Transaction with transactionSSN ${transactionSSN} updated`)
        })

    poo.query(
        'UPDATE Items SET transactionSSN = NULL WHERE transactionSSN = $1', [transactionSSN],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Item with transactionSSN ${transactionSSN} updated`)
        })
}

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    createItem,
    deleteItem,
    loanedItem,
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
}
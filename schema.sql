CREATE TABLE Users (
    userSSN SERIAL,
    userName VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(30),
    age INTEGER,
    email VARCHAR(30),
    dob DATE,
    phoneNum VARCHAR(30),
    address VARCHAR(100),
    nationality VARCHAR(100),
    PRIMARY KEY (userSSN)
);

CREATE TABLE Loaners (
    loanerSSN INTEGER,
    PRIMARY KEY (loanerSSN ),
    FOREIGN KEY (loanerSSN ) REFERENCES Users(userSSN)
);

CREATE TABLE Transactions (
    transactionSSN SERIAL,
    loanedItemSSN INTEGER NOT NULL,
    paidStatus BOOLEAN NOT NULL,
    returnedStatus BOOLEAN NOT NULL,
    startDate DATE,
    endDate DATE,
    PRIMARY KEY (transactionSSN)
);

CREATE TABLE Items (
    itemSSN SERIAL,
    transactionSSN INTEGER,
    loanedByUserSSN INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    minBidPrice INTEGER NOT NULL,
    loanDuration INTEGER,
    PRIMARY KEY (itemSSN),
    FOREIGN KEY (loanedByUserSSN ) REFERENCES Loaners(loanerSSN),
    FOREIGN KEY (transactionSSN) REFERENCES Transactions(transactionSSN)
);

ALTER TABLE Transactions
    ADD CONSTRAINT transactions_loaneditemssn_fkey FOREIGN KEY (loaneditemssn) REFERENCES  items(itemssn)
;

CREATE TABLE Bids (
    bidSSN SERIAL,
    placedBySSN INTEGER NOT NULL,
    itemSSN INTEGER NOT NULL,
    bidAmt INTEGER,
    bidDateTime TIMESTAMP,
    PRIMARY KEY (bidSSN),
    FOREIGN KEY (placedBySSN) REFERENCES Users(userSSN),
    FOREIGN KEY (itemSSN) REFERENCES Items(itemSSN)
);

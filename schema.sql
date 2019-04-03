DROP TABLE Users CASCADE;
DROP TABLE Loaners CASCADE;
DROP TABLE Borrowers CASCADE;
DROP TABLE Feedbacks CASCADE;
DROP TABLE Payments CASCADE;
DROP TABLE Items CASCADE;
DROP TABLE Bids CASCADE;
DROP TABLE Transactions CASCADE;
DROP TABLE Borrows CASCADE;
DROP TABLE WinningBids CASCADE;

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
    FOREIGN KEY (loanerSSN ) REFERENCES Users(userSSN) ON DELETE CASCADE
);

CREATE TABLE Borrowers (
    borrowerSSN INTEGER,
    PRIMARY KEY (borrowerSSN ),
    FOREIGN KEY (borrowerSSN ) REFERENCES Users(userSSN) ON DELETE CASCADE
);

CREATE TABLE Feedbacks (
    feedbackSSN	SERIAL,
    givenByUserSSN INTEGER NOT NULL,
    receivedByUserSSN INTEGER NOT NULL,
    commentType TEXT NOT NULL,
    commentBody TEXT NOT NULL,
    PRIMARY KEY (feedbackSSN),
    FOREIGN KEY (givenByUserSSN ) REFERENCES Users(userSSN) ON DELETE CASCADE, 
    FOREIGN KEY (receivedByUserSSN ) REFERENCES Users(userSSN) ON DELETE CASCADE
);

CREATE TABLE Payments (
    paymentSSN SERIAL,
    paymentType VARCHAR(30) NOT NULL,
    paymentAmount INTEGER NOT NULL,
    madeByUserSSN INTEGER NOT NULL,
    receivedByUserSSN INTEGER NOT NULL,
    PRIMARY KEY (paymentSSN),
    FOREIGN KEY (madeByUserSSN) REFERENCES Users(userSSN) ON DELETE CASCADE,
    FOREIGN KEY (receivedByUserSSN) REFERENCES Users(userSSN) ON DELETE CASCADE
);

CREATE TABLE Items (
    itemSSN SERIAL,
    loanedByUserSSN INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    minBidPrice INTEGER NOT NULL,
    loanDurationInDays INTEGER,
    PRIMARY KEY (itemSSN),
    FOREIGN KEY (loanedByUserSSN ) REFERENCES Loaners(loanerSSN) ON DELETE CASCADE
);

CREATE TABLE Bids (
    bidSSN SERIAL,
    placedBySSN INTEGER NOT NULL,
    itemSSN INTEGER NOT NULL,
    bidAmt INTEGER,
    bidDateTime TIMESTAMP,
    PRIMARY KEY (bidSSN),
    FOREIGN KEY (placedBySSN) REFERENCES Users(userSSN) ON DELETE CASCADE,
    FOREIGN KEY (itemSSN) REFERENCES Items(itemSSN) ON DELETE CASCADE
);

CREATE TABLE Transactions (
    transactionSSN SERIAL,
    itemSSN INTEGER NOT NULL,
    paymentSSN INTEGER NOT NULL,
    paidStatus BOOLEAN NOT NULL,
    returnedStatus BOOLEAN NOT NULL,
    startDate DATE,
    endDate DATE,
    PRIMARY KEY (transactionSSN),
    FOREIGN KEY (itemSSN) REFERENCES Items(itemSSN) ON DELETE CASCADE,
    FOREIGN KEY (paymentSSN) REFERENCES Payments(paymentSSN) ON DELETE CASCADE
);

CREATE TABLE Borrows (
    itemSSN SERIAL,
    borrowerSSN INTEGER,
    transactionSSN INTEGER NOT NULL,
    PRIMARY KEY (itemSSN, borrowerSSN, transactionSSN),
    FOREIGN KEY (itemSSN) REFERENCES Items(itemSSN),
    FOREIGN KEY (borrowerSSN) REFERENCES Borrowers(borrowerSSN) ON DELETE CASCADE,
    FOREIGN KEY (transactionSSN) REFERENCES Transactions(transactionSSN) ON DELETE CASCADE
);

CREATE TABLE WinningBids (
    bidSSN SERIAL,
    itemSSN	INTEGER,
    PRIMARY KEY (bidSSN, itemSSN),
    FOREIGN KEY (bidSSN) REFERENCES Bids(bidSSN) ON DELETE CASCADE,
    FOREIGN KEY (itemSSN) REFERENCES Items(itemSSN) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION not_exist_loaner_upon_create_item()
RETURNS TRIGGER AS
$$
DECLARE count NUMERIC;
BEGIN
SELECT COUNT(*) INTO count
FROM Loaners
WHERE NEW.loanedbyuserssn = Loaners.loanerssn;
IF count > 0 THEN
RETURN NEW;
ELSE
INSERT INTO Loaners VALUES (NEW.loanedbyuserssn); RETURN NEW;
END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER loaner_item
BEFORE INSERT OR UPDATE
ON Items
FOR EACH ROW
EXECUTE PROCEDURE not_exist_loaner_upon_create_item();
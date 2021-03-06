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
    PRIMARY KEY (userSSN),
    CHECK (userName <> '')
);

CREATE TABLE Loaners (
    loanerSSN INTEGER,
    PRIMARY KEY (loanerSSN),
    FOREIGN KEY (loanerSSN) REFERENCES Users(userSSN) ON DELETE CASCADE
);

CREATE TABLE Borrowers (
    borrowerSSN INTEGER,
    PRIMARY KEY (borrowerSSN),
    FOREIGN KEY (borrowerSSN) REFERENCES Users(userSSN) ON DELETE CASCADE
);

CREATE TABLE Feedbacks (
    feedbackSSN SERIAL,
    givenByUserSSN INTEGER NOT NULL,
    receivedByUserSSN INTEGER NOT NULL,
    commentType TEXT NOT NULL,
    commentBody TEXT NOT NULL,
    PRIMARY KEY (feedbackSSN),
    FOREIGN KEY (givenByUserSSN) REFERENCES Users(userSSN) ON DELETE CASCADE, 
    FOREIGN KEY (receivedByUserSSN) REFERENCES Users(userSSN) ON DELETE CASCADE,
    CHECK (commentType <> ''),
    CHECK (commentBody <> '')
);

CREATE TABLE Payments (
    paymentSSN SERIAL,
    paymentType VARCHAR(30) NOT NULL,
    paidStatus BOOLEAN NOT NULL,
    paymentAmount INTEGER NOT NULL,
    madeByUserSSN INTEGER NOT NULL,
    receivedByUserSSN INTEGER NOT NULL,
    PRIMARY KEY (paymentSSN),
    FOREIGN KEY (madeByUserSSN) REFERENCES Users(userSSN) ON DELETE CASCADE,
    FOREIGN KEY (receivedByUserSSN) REFERENCES Users(userSSN) ON DELETE CASCADE
);

CREATE TABLE Items (
    itemSSN SERIAL,
    loanedBySSN INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    minBidPrice INTEGER NOT NULL,
    loanDurationInDays INTEGER NOT NULL,
    PRIMARY KEY (itemSSN),
    FOREIGN KEY (loanedBySSN) REFERENCES Loaners(loanerSSN) ON DELETE CASCADE,
    CHECK (name <> ''),
    CHECK (description <> ''),
    CHECK (minBidPrice >= 0),
    CHECK (loanDurationInDays >= 0)
);

CREATE TABLE Bids (
    bidSSN SERIAL,
    placedBySSN INTEGER NOT NULL,
    itemSSN INTEGER NOT NULL,
    bidAmt INTEGER,
    bidDateTime TIMESTAMP,
    PRIMARY KEY (bidSSN),
    FOREIGN KEY (placedBySSN) REFERENCES Users(userSSN) ON DELETE CASCADE,
    FOREIGN KEY (itemSSN) REFERENCES Items(itemSSN) ON DELETE CASCADE,
    CHECK (bidAmt >= 0)
);

CREATE TABLE Transactions (
    transactionSSN SERIAL,
    itemSSN INTEGER,
    paymentSSN INTEGER NOT NULL,
    returnedStatus BOOLEAN NOT NULL,
    startDate DATE,
    endDate DATE,
    PRIMARY KEY (transactionSSN),
    FOREIGN KEY (itemSSN) REFERENCES Items(itemSSN) ON DELETE CASCADE,
    FOREIGN KEY (paymentSSN) REFERENCES Payments(paymentSSN) ON DELETE CASCADE
);

CREATE TABLE Borrows (
    itemSSN INTEGER,
    borrowerSSN INTEGER,
    transactionSSN INTEGER NOT NULL,
    PRIMARY KEY (itemSSN, borrowerSSN, transactionSSN),
    FOREIGN KEY (itemSSN) REFERENCES Items(itemSSN) ON DELETE CASCADE,
    FOREIGN KEY (borrowerSSN) REFERENCES Borrowers(borrowerSSN) ON DELETE CASCADE,
    FOREIGN KEY (transactionSSN) REFERENCES Transactions(transactionSSN) ON DELETE CASCADE
);

CREATE TABLE WinningBids (
    bidSSN INTEGER,
    itemSSN	INTEGER,
    PRIMARY KEY (bidSSN, itemSSN),
    FOREIGN KEY (bidSSN) REFERENCES Bids(bidSSN) ON DELETE CASCADE,
    FOREIGN KEY (itemSSN) REFERENCES Items(itemSSN) ON DELETE CASCADE
);

-- Trigger 1
CREATE OR REPLACE FUNCTION create_loaner_if_not_exists()
RETURNS TRIGGER AS
$$
DECLARE count NUMERIC;
BEGIN
SELECT COUNT(*) INTO count
FROM Loaners
WHERE NEW.loanedbyssn = Loaners.loanerssn;
IF count > 0 THEN
RETURN NEW;
ELSE
INSERT INTO Loaners VALUES (NEW.loanedbyssn);
RETURN NEW;
END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER create_loaner_if_not_exists
BEFORE INSERT OR UPDATE
ON Items
FOR EACH ROW
EXECUTE PROCEDURE create_loaner_if_not_exists();

-- Trigger 2
CREATE OR REPLACE FUNCTION create_borrower_if_not_exists()
RETURNS TRIGGER AS
$$
DECLARE count NUMERIC;
BEGIN
SELECT COUNT(*) INTO count
FROM Borrowers
WHERE NEW.borrowerssn = Borrowers.borrowerssn;
IF count > 0 THEN
RETURN NEW;
ELSE
INSERT INTO Borrowers VALUES (NEW.borrowerssn);
RETURN NEW;
END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER create_borrower_if_not_exists
BEFORE INSERT OR UPDATE
ON Borrows
FOR EACH ROW
EXECUTE PROCEDURE create_borrower_if_not_exists();

-- Trigger 3
CREATE OR REPLACE FUNCTION update_payment_propagates_to_transaction()
RETURNS TRIGGER AS
$$
DECLARE
transactionrow Transactions%ROWTYPE;
duration INTEGER;
BEGIN
SELECT * INTO transactionrow
FROM Transactions
WHERE NEW.paymentssn = Transactions.paymentssn;
SELECT I.loandurationindays INTO duration
FROM Items I
WHERE I.itemssn = transactionrow.itemssn;
UPDATE Transactions
SET startDate = CURRENT_DATE, endDate = CURRENT_DATE + duration
WHERE transactionssn = transactionrow.transactionssn;
INSERT INTO
Borrows (itemssn, borrowerssn, transactionssn)
VALUES
(transactionrow.itemssn, NEW.madebyuserssn, transactionrow.transactionssn);
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER update_payment_propagates_to_transaction
AFTER UPDATE
ON Payments
FOR EACH ROW
EXECUTE PROCEDURE update_payment_propagates_to_transaction();

-- Trigger 4
CREATE OR REPLACE FUNCTION delete_payment_propagates_to_bids()
RETURNS TRIGGER AS
$$
DECLARE
transactionrow Transactions%ROWTYPE;
BEGIN
SELECT * INTO transactionrow
FROM Transactions
WHERE OLD.paymentssn = Transactions.paymentssn;
DELETE FROM Bids
WHERE itemssn = transactionrow.itemssn AND placedbyssn = OLD.madebyuserssn;
RETURN OLD;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER delete_payment_propagates_to_bids
BEFORE DELETE
ON Payments
FOR EACH ROW
EXECUTE PROCEDURE delete_payment_propagates_to_bids();

-- Trigger 5
CREATE OR REPLACE FUNCTION duplicate_item_after_return()
RETURNS TRIGGER AS
$$
DECLARE
itemrow Items%ROWTYPE;
BEGIN
IF NEW.returnedStatus = TRUE THEN
SELECT * INTO itemrow
FROM Items
WHERE NEW.itemssn = Items.itemssn;
INSERT INTO Items (loanedbyssn, name , description , minBidPrice , loanDurationInDays)
VALUES (itemrow.loanedbyssn, itemrow.name, itemrow.description, itemrow.minBidPrice, itemrow.loanDurationInDays);
RETURN NULL;
ELSE
RETURN NULL;
END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER duplicate_item_after_return
AFTER UPDATE
ON Transactions
FOR EACH ROW
EXECUTE PROCEDURE duplicate_item_after_return();

-- Trigger 6
CREATE OR REPLACE FUNCTION check_bidamt_according_to_minbidprice()
RETURNS TRIGGER AS
$$
DECLARE
itemrow Items%ROWTYPE;
BEGIN
SELECT * INTO itemrow
FROM Items
WHERE NEW.itemssn = Items.itemssn;
IF NEW.bidamt >= itemrow.minbidprice THEN
RETURN NEW;
ELSE
RAISE EXCEPTION 'Bid amount cannot be lower than minimum bid price';
RETURN NULL;
END IF;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER check_bidamt_according_to_minbidprice
BEFORE INSERT
ON Bids
FOR EACH ROW
EXECUTE PROCEDURE check_bidamt_according_to_minbidprice();

-- Trigger 7
CREATE OR REPLACE FUNCTION delete_bids_less_than_newminbidprice()
RETURNS TRIGGER AS
$$
BEGIN
DELETE FROM Bids
WHERE Bids.itemssn = NEW.itemssn AND Bids.bidamt < NEW.minbidprice;
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER delete_bids_less_than_newminbidprice
AFTER UPDATE
ON Items
FOR EACH ROW
EXECUTE PROCEDURE delete_bids_less_than_newminbidprice();
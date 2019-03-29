const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const cors = require('cors');

require('dotenv').config();

const passport = require('./config/authentication');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const playgroundRouter = require('./routes/playground');
const authenticationRouter = require('./routes/authenticate');
const itemRouter = require('./routes/items');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../my-app/build')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/playground', playgroundRouter);
app.use('/authenticate', authenticationRouter);
app.use('/items', itemRouter);

module.exports = app;

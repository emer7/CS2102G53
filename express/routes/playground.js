const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');

const passport = require('../config/authentication');
const pool = require('../config/db');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('This is a playground to test features. Access /auth to check if you are logged in');
});

router.get('/login', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'playground.html'));
});

router.get('/auth', (req, res) => {
  req.isAuthenticated() ? res.send('You are logged in') : res.redirect('/playground/login');
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/playground');
});

router.post('/register', (req, res) => {
  const { username, pass } = req.body;

  bcrypt.hash(pass, 12, (err, hash) => {
    const query = 'INSERT INTO accounts (username, pass) VALUES ($1, $2)';
    const values = [username, hash];

    pool.query(query, values, (errorQuery, resultQuery) => {
      if (errorQuery) {
        res.send('error');
      } else {
        res.redirect('/playground/login');
      }
    });
  });
});

router.post('/echo', (req, res) => {
  res.send(req.body);
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt');

const passport = require('../config/authentication');
const pool = require('../config/db');

const router = express.Router();

router.get('/check', (req, res) => {
  res.send(req.isAuthenticated());
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send(true);
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 12, (err, hash) => {
    const query = 'INSERT INTO accounts (username, pass) VALUES ($1, $2)';
    const values = [username, hash];

    pool.query(query, values, (errorQuery) => {
      if (errorQuery) {
        res.send('error');
      } else {
        res.send(true);
      }
    });
  });
});

module.exports = router;

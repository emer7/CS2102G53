const express = require('express');
const bcrypt = require('bcrypt');

const passport = require('../config/authentication');
const pool = require('../config/db');

const router = express.Router();

router.get('/check', (req, res) => {
  res.send(req.isAuthenticated() ? { login: true } : {});
});

router.post('/login', (req, res) => {
  passport.authenticate('local', (errorAuthenticate, user, info) => {
    if (errorAuthenticate) {
      res.send(errorAuthenticate);
    }

    if (user) {
      req.login(user, (errorLogin) => {
        if (errorLogin) {
          res.send(errorLogin);
        } else {
          res.send({ message: 'Successfully login', login: true, user });
        }
      });
    } else {
      res.send(info);
    }
  })(req, res);
});

router.post('/register', (req, res) => {
  const {
    username, password, name, age, email, dob, phoneNum, address, nationality,
  } = req.body;

  bcrypt.hash(password, 12, (errorHash, hash) => {
    if (errorHash) {
      res.send({ message: 'Password cannot be empty' });
    } else {
      const query = 'INSERT INTO users (username, password, name, age, email, dob, phonenum, address, nationality) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const values = [username, hash, name, age, email, dob, phoneNum, address, nationality];

      pool.query(query, values, (errorQuery) => {
        if (errorQuery) {
          res.send(errorQuery);
        } else {
          res.send(true);
        }
      });
    }
  });
});

module.exports = router;

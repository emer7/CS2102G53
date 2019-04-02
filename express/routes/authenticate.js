const express = require('express');

const passport = require('../config/authentication');

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
          res.send({
            message: 'Successfully login',
            login: true,
            user: { userssn: user.userssn, username: user.username },
          });
        }
      });
    } else {
      res.send(info);
    }
  })(req, res);
});

module.exports = router;

const express = require('express');

const passport = require('../config/authentication');

const router = express.Router();

router.get('/check', (request, response) => {
  response.send(request.isAuthenticated() ? { login: true } : {});
});

router.post('/login', (request, response) => {
  passport.authenticate('local', (errorAuthenticate, user, info) => {
    if (errorAuthenticate) {
      response.send(errorAuthenticate);
    }

    if (user) {
      request.login(user, (errorLogin) => {
        if (errorLogin) {
          response.send(errorLogin);
        } else {
          response.send({
            message: 'Successfully login',
            login: true,
            user: { userssn: user.userssn, username: user.username },
          });
        }
      });
    } else {
      response.send(info);
    }
  })(request, response);
});

router.post('/logout', (request, response) => {
  request.logOut();
  response.send({
    message: 'Successfully logout',
    login: false,
  });
});

module.exports = router;

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('./db');

passport.use(
  new LocalStrategy({ usernameField: 'foo', passwordField: 'bar' }, (username, pass, done) => {
    const query = 'SELECT accountid, username, pass FROM accounts WHERE username=$1';
    const values = [username];

    pool.query(query, values, (errorQuery, resultQuery) => {
      if (errorQuery) {
        done(errorQuery);
      }

      if (resultQuery.rows || resultQuery.rows.length > 0) {
        const first = resultQuery.rows[0];
        bcrypt.compare(pass, first.pass, (errorBcrypt, resultBcrypt) => {
          if (errorBcrypt) {
            done(errorBcrypt);
          }

          if (resultBcrypt) {
            done(null, first);
          }
          done(null, false, { message: 'Incorrect password.' });
        });
      } else {
        done(null, false);
      }
    });
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.accountid);
});

passport.deserializeUser((accountid, done) => {
  const query = 'SELECT accountid, username, pass FROM accounts WHERE accountid=$1';
  const values = [accountid];
  pool.query(query, values, (errorQuery, resultQuery) => {
    if (errorQuery) {
      done(errorQuery);
    }
    done(null, resultQuery.rows[0]);
  });
});

module.exports = passport;

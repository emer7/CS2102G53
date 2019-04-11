const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('./db');

passport.use(
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    (username, password, done) => {
      const query = 'SELECT userssn, username, password FROM users WHERE username=$1';
      const values = [username];

      pool.query(query, values, (errorQuery, resultQuery) => {
        if (errorQuery) {
          done(errorQuery);
        }

        if (resultQuery && resultQuery.rows && resultQuery.rows.length > 0) {
          const firstRow = resultQuery.rows[0];
          bcrypt.compare(password, firstRow.password, (errorCompare, resultBcrypt) => {
            if (errorCompare) {
              done(errorCompare);
            }

            if (resultBcrypt) {
              done(null, firstRow);
            } else {
              done(null, false, { errorMessage: 'Incorrect password' });
            }
          });
        } else {
          done(null, false, { errorMessage: 'User not found' });
        }
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.userssn);
});

passport.deserializeUser((userSSN, done) => {
  const query = 'SELECT userssn, username, password FROM users WHERE userssn=$1';
  const values = [userSSN];
  pool.query(query, values, (errorQuery, resultQuery) => {
    if (errorQuery) {
      done(errorQuery);
    } else {
      done(null, resultQuery.rows[0]);
    }
  });
});

module.exports = passport;

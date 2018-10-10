const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const models = require('./models');

passport.use(new BearerStrategy((token, done) => {
    if (token === null || token === undefined) {
      return done(null, false, {message: 'Could not authorize'});
    }
    models.token.findOne({
      where: {
        clienttoken: token
      },
      include: [models.user]
    }).then(function (token) {
      if (token && token.user) {
        return done(null, token.user);
      }
      else {
        return done(null, false, {message: 'Could not authorize'});
      }
    }).catch(function (err) {
      return done(err, false);
    });
  })
);
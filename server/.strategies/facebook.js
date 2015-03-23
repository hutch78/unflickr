var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('mongoose').model('User');

//  OAuth 2.0 with the facebook api & passport-facebook module
//  https://github.com/jaredhanson/passport-facebook

module.exports = function() {
  
  passport.use(new FacebookStrategy({
      clientID: '1584644015126726',
      clientSecret: '2a51f97fe3c3a69e148fc70077a4a64e',
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      enableProof: false
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ));
};


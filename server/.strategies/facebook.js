var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('mongoose').model('User');

//  OAuth 2.0 with the facebook api & passport-facebook module
//  https://github.com/jaredhanson/passport-facebook

module.exports = function() {
  
      // used to serialize the user for the session
      passport.serializeUser(function(user, done) {
          done(null, user.id);
      });

      // used to deserialize the user
      passport.deserializeUser(function(id, done) {
          User.findById(id, function(err, user) {
              done(err, user);
          });
      });
      
      // code for login (use('local-login', new LocalStategy))
      // code for signup (use('local-signup', new LocalStategy))

      // =========================================================================
      // FACEBOOK ================================================================
      // =========================================================================
      passport.use(new FacebookStrategy({

          // pull in our app id and secret from our auth.js file
          clientID: '1584644015126726',
          clientSecret: '2a51f97fe3c3a69e148fc70077a4a64e',
          callbackURL: "http://45.55.177.119:3000/auth/facebook/callback",
          // callbackURL: "http://localhost:3000/auth/facebook/callback",
          enableProof: false

      },

      // facebook will send back the token and profile
      function(token, refreshToken, profile, done) {

          // asynchronous
          process.nextTick(function() {

              // find the user in the database based on their facebook id
              User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                  // if there is an error, stop everything and return that
                  // ie an error connecting to the database
                  if (err)
                      return done(err);

                  // if the user is found, then log them in
                  if (user) {
                      return done(null, user); // user found, return that user
                  } else {
                      // if there is no user found with that facebook id, create them
                      var newUser            = new User();

                      newUser.username  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                      newUser.provider  = "facebook";

                      // set all of the facebook information in our user model
                      newUser.facebook.id    = profile.id; // set the users facebook id                   
                      newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                      newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                      newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                      // save our user to the database
                      newUser.save(function(err) {
                          if (err)
                              throw err;

                          // if successful, return the new user
                          return done(null, newUser);
                      });
                  }

              });
          });

      }));






};


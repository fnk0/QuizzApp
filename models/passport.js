const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./user');

/**
 * Defines how passport should validate a user using LocalStrategy
 * This strategy will be automatically used when using
 * passport.authenticate('local', ...)
 */
passport.use(new LocalStrategy({
        usernameField: 'email' // use the email as the username for this user
    },
    function(username, password, done) {
        User.findOne({ email: username }, function (err, user) {
            if (err) {
                return done(err);
            }
            // Return if user not found in database
            if (!user) {
                return done(null, false, {
                    message: 'User not found'
                });
            }

            // Check if the user is active
            if (!user.active) {
                return done(null, false, {
                    message: 'Account not active. Please check your email.'
                });
            }

            // Return if password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Password is wrong'
                });
            }
            // If credentials are correct, return the user object
            return done(null, user);
        });
    }
));
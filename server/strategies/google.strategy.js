const passport = require('passport');
//new google strategy has to be required
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const pool = require('../modules/pool.js');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM employee WHERE id = $1', [id]).then((result) => {
        // Handle Errors
        const user = result && result.rows && result.rows[0];

        if (!user) {
            // user not found
            done(null, false, {
                message: 'Incorrect credentials.'
            });
        } else {
            // user found
            delete user.login_password; // remove password so it doesn't get sent
            done(null, user);
        }
    }).catch((err) => {
        console.log('query err ', err);
        done(err);
    });
});

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        passReqToCallback: true
    }, function (req, accessToken, refreshToken, profile, done) {
        console.log("THIS IS THE PROFILE", profile);
        //console.log("THIS IS THE PROFILE NAME", profile.displayName);
        //console.log("THIS IS THE PROFILE EMAIL", profile.emails[0].value);
        //console.log("THIS IS THE PROFILE PIC", profile.photos[0].value );
        let user = {};
        //selecting the user from database and setting them as this session's user
        pool.query("SELECT * FROM employee WHERE email = $1",
            [profile.emails[0].value], // TODO: Check e-mails at other indexes
            function (err, result) {
                if (err) {
                    console.log('query err ', err);
                    done(err);
                }
                user = result.rows[0];
                console.log('this is the user', user);
                const is_active = result.rows[0].is_active
                if (!user) {
                    // user not found
                    return done(null, false, {
                        message: 'Incorrect credentials.'
                    });
                } else if (is_active == false){
                    return done(null, false, {
                        message: 'YOU DONT HAVE ACCESS'
                    })
                }else {
                    // user found
                    console.log('User row ', user);
                    // Done sets user on the req (e.g. req.user = user) for the session
                    done(null, user);
                }
            });
    } //end of function
)); //end of new GoogleStrategy

module.exports = passport;
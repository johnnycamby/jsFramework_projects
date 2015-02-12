

(function (auth) {
    
    var data = require('../data');
    var hasher = require('./hasher');
    var passport = require('passport');
    var localStrategy = require('passport-local').Strategy;
    
    function userVerify(username, password, next){
    
        data.getUser(username, function (err, user) {
            if (!err && user) {
                var testHash = hasher.computeHash(password, user.salt);
                if (testHash === user.passwordHash) {
                
                    next(null, user);
                    return;
                }
            }
            next(null, false, { message: 'Invalid Credentials.' });
        });
    }
    
    // Page protection 
   auth.ensureAuthenticated = function (req, res, next) { 
    
        if (req.isAuthenticated()) {
        
            next();
        } else {
        
            res.redirect('/login');
        }
    };
    
    // Api protection 
    auth.ensureApiAuthenticated = function (req, res, next) {
        
        if (req.isAuthenticated()) {
            
            next();
        } else {
            
            res.send(401, 'Not authorized');
        }
    };
    
   
    auth.init = function (app) {
        
        // Setup passport authentication
        passport.use(new localStrategy(userVerify));
        passport.serializeUser(function (user, next) {
            
            next(null, user.username);
        });
        
        passport.deserializeUser(function (key, next) {
            
            data.getUser(key, function (err, user) {
                
                if (err || !user) {
                    
                    next(null, false, { message: 'Could not find user' });
                } else {
                    
                    next(null, user);
                }
            });
        });
                
        app.use(passport.initialize()); // express + nodejs middleware
        app.use(passport.session()); // use session to store the user for the entire session
        
        app.get('/login', function (req, res) {
            
            res.render(
                    'login',
                    {
                title : 'Login to The DashBoard',
                message: req.flash('login-Error')
            }
          );
        });
        
        app.post('/login', function (req, res, next) {
            
            var authFunction = passport.authenticate('local', function (err, user, info) {
                
                if (err) {
                    
                    next(err);
                } else if (!user) {
                    req.flash('error', info.message);
                    res.redirect('/login');
                }
                
                else {
                    
                    req.logIn(user, function (err) {
                        
                        if (err) {
                            next(err);
                        } else {
                            
                            res.redirect('/');
                        }

                    });
                }
            });
            
            authFunction(req, res, next);
        });
    
        

        //get registation page
        app.get('/register', function (req, res) {
             
            res.render('register', 
                {
                title: 'Registration for DashBoard',
                message: req.flash('registration-Error')
            });
        });
        
        /*
         * Do n't store the password in the db coz it leaves us vanalable attacker.
         * So we share only store a hash of a password
         */
        app.post('/register', function (req, res) {
            
            var salt = hasher.createSalt();
            
            var user = {
                
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                passwordHash: hasher.computeHash(req.body.password,salt),
                salt: salt
            };
            
            
            data.addUser(user, function (err) {
            
                if (err) {
                    req.flash('registration-Error', 'Could not save user to the database.');
                    res.redirect('/register');
                } else {
                
                    res.redirect('/login');

                }
            });
        });
    };


})(module.exports);
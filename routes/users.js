const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

// router for the user registration form page
router.get('/register', (req, res) => {
    res.render('users/register');
});

// router for the user registration post
router.post('/register', catchAsync(async(req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        // the method .register adds salt and hash the password before storing to db
        const registeredUser = await User.register(user, password);
        // automatically log the new registered user in
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to the world of owls :)');
            res.redirect('/watchingspots');
        })
    } catch(error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
}));

// router for login form page
router.get('/login', (req, res) => {
    res.render('users/login');
});

// router for login post
// this post request uses 'Passport' to authenticate username and password
router.post('/login',
            passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
            (req, res) => {
                req.flash('success', 'Welcome back');
                // after logging in, redirect the user to the previously viewed page
                const redirectUrl = req.session.returnTo || '/watchingspots';
                delete req.session.returnTo;
                res.redirect(redirectUrl);
});

// router for logout
router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success', 'Successfully logged out');
    res.redirect('/watchingspots');
});

module.exports = router;
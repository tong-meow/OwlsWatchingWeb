const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

// require controller
const users = require('../controllers/users');


/******* Routers ******/

router.route('/register')
    // router for the user registration form page
    .get(users.renderRegister)
    // router for the user registration post
    .post(catchAsync(users.register));

router.route('/login')
    // router for login form page
    .get(users.renderLogin)
    // router for login post
    // this post request uses 'Passport' to authenticate username and password
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
        users.login);

// router for logout
router.get('/logout', users.logout);

module.exports = router;
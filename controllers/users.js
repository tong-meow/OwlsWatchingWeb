const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async(req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    // after logging in, redirect the user to the previously viewed page
    const redirectUrl = req.session.returnTo || '/watchingspots';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) =>{
    req.logout();
    req.flash('success', 'Successfully logged out');
    res.redirect('/watchingspots');
};
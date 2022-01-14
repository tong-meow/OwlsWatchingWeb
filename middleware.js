// isLoggedIn is a middleware to check if a user is currently logged in
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please sign in first');
        return res.redirect('/login');
    }
    next();
}
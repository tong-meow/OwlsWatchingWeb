const { wsSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Watchingspot = require('./models/watchingspot');


// isLoggedIn is a middleware to check if a user is currently logged in
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please sign in first');
        return res.redirect('/login');
    }
    next();
}


// validateWS is a middleware to check the validation of form for creating a new watching spot
module.exports.validateWS = (req, res, next) => {
    const { error } = wsSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


// verifyAuthor is a middleware to verify if the current user is the author of the watching spot
module.exports.verifyAuthor = async(req, res, next) => {
    const { id } = req.params;
    const wspot = await Watchingspot.findById(id);
    // notice: admin is authorized
    if (!req.user._id == '61e12faa1c3ad7288119d87f' && 
        !wspot.author.equals(req.user._id)) {
        req.flash('error', 'Sorry, you do not have permission to do that');
        return res.redirect(`/watchingspots/${id}`);
    }
    next();
}


// validateReview is a middleware to check if the review is validate
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
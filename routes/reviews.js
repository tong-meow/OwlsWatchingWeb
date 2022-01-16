// require express and router
const express = require('express');

// set mergeParams to true to use the request params
const router = express.Router({ mergeParams: true });

// require schemas and models
const Watchingspot = require('../models/watchingspot');
const Review = require('../models/review');

// require middlewares
const { validateReview, isLoggedIn, verifyReviewAuthor } = require('../middleware');

// require other supporting tools
const catchAsync = require('../utils/catchAsync');



// create a review for a watching spot
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const ws = await Watchingspot.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    ws.reviews.push(review);
    await review.save();
    await ws.save();
    req.flash('success', 'Thank you for your review!');
    res.redirect(`/watchingspots/${ws._id}`);
}))

// delete a watching spot review
router.delete('/:reviewId', isLoggedIn, verifyReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Watchingspot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Your review is successfully deleted!')
    res.redirect(`/watchingspots/${id}`);
}))

// export the router
module.exports = router;
// require express and router
const express = require('express');

// set mergeParams to true to use the request params
const router = express.Router({ mergeParams: true });

// require middlewares
const { validateReview, isLoggedIn, verifyReviewAuthor } = require('../middleware');

// require other supporting tools
const catchAsync = require('../utils/catchAsync');

// require controllers
const reviews = require('../controllers/reviews');


/******* Routers ******/

// create a review for a watching spot
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// delete a watching spot review
router.delete('/:reviewId', isLoggedIn, verifyReviewAuthor, catchAsync(reviews.deleteReview));

// export the router
module.exports = router;
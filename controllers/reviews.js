// require schemas and models
const Watchingspot = require('../models/watchingspot');
const Review = require('../models/review');


module.exports.createReview = async (req, res) => {
    const ws = await Watchingspot.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    ws.reviews.push(review);
    await review.save();
    await ws.save();
    req.flash('success', 'Thank you for your review!');
    res.redirect(`/watchingspots/${ws._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Watchingspot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Your review is successfully deleted!')
    res.redirect(`/watchingspots/${id}`);
};
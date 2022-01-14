const express = require('express');
const router = express.Router();

const Watchingspot = require('../models/watchingspot');
const { wsSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


// middleware: check the validation of form for creating a new watching spot
const validateWS = (req, res, next) => {
    const { error } = wsSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


// GET /watchingspots : the index of all owls watching spots
router.get('/', catchAsync(async (req, res) => {
    const watchingspots = await Watchingspot.find({});
    res.render('watchingspots/index', { watchingspots });
}))

// GET /watchingspots/new : create a new watching spot
router.get('/new', isLoggedIn, (req, res) => {
    res.render('watchingspots/new');
})

// POST /watchingspots : post the new watching spot
// and redirect to the index page of watching spots
router.post('/', isLoggedIn, validateWS, catchAsync(async (req, res) => {
    // handle error if the body doesn't exist
    // if (!req.body.watchingspot) throw new ExpressError('Invalid Watchingspot Data', 400);
    const ws = new Watchingspot(req.body.watchingspot);
    await ws.save();
    req.flash('success', 'Thank you! A new watching spot is successuly added!')
    res.redirect(`/watchingspots/${ws._id}`);
}))

// GET /watchingspots/:id : view one watching spot's information page
router.get('/:id', catchAsync(async (req, res) => {
    const ws = await Watchingspot.findById(req.params.id).populate('reviews');
    // if the id is not found, redirect to the index page
    // flash the error message
    if(!ws){
        req.flash('error', 'Oops, this watching spot is not found');
        return res.redirect('/watchingspots');
    }
    res.render('watchingspots/show', { ws });
}))

// GET /watchingspots/:id/edit : edit page of a watching spot
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const ws = await Watchingspot.findById(req.params.id);
    // if the id is not found, redirect to the index page
    // flash the error message
    if(!ws){
        req.flash('error', 'Oops, this watching spot is not found');
        return res.redirect('/watchingspots');
    }
    res.render('watchingspots/edit', { ws });
}))

// PUT /watchingspots/:id : submit edit
router.put('/:id', isLoggedIn, validateWS, catchAsync(async (req, res) => {
    const { id } = req.params;
    const ws = await Watchingspot.findByIdAndUpdate(id, { ...req.body.watchingspot });
    req.flash('success', 'Thank you! The watching spot is successufully updated!')
    res.redirect(`/watchingspots/${ws._id}`);
}))

// DELETE /watchingspots/:id : submit delete request
// and redirect to the index page of watching spots
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Watchingspot.findByIdAndDelete(id);
    req.flash('success', 'The watching spot is successufully deleted')
    res.redirect('/watchingspots');
}))

// export this router
module.exports = router;
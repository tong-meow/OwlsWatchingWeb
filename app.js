const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { wsSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const methodOverride = require('method-override');
const Watchingspot = require('./models/watchingspot');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/owls-watch');

// connect to the mongo database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database connection error:"));
db.once("open", () => {
    console.log("Database connected.");
});

const app = express();

// set ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// check the validation for post and put
const validateWS = (req, res, next) => {
    const { error } = wsSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// GET / : homepage
app.get('/', (req, res) => {
    res.render('home');
})

// GET /watchingspots : all owls watching spots index
app.get('/watchingspots', catchAsync(async (req, res) => {
    const watchingspots = await Watchingspot.find({});
    res.render('watchingspots/index', { watchingspots });
}))

// GET /watchingspots/new : add a new watching spot
app.get('/watchingspots/new', (req, res) => {
    res.render('watchingspots/new');
})

// POST /watchingspots : post the new watching spot
// and redirect to the index page of watching spots
app.post('/watchingspots', validateWS, catchAsync(async (req, res) => {
    // handle error if the body doesn't exist
    // if (!req.body.watchingspot) throw new ExpressError('Invalid Watchingspot Data', 400);
    const ws = new Watchingspot(req.body.watchingspot);
    await ws.save();
    res.redirect(`/watchingspots/${ws._id}`);
}))

// GET /watchingspots/:id : view one watching spot's information page
app.get('/watchingspots/:id', catchAsync(async (req, res) => {
    const ws = await Watchingspot.findById(req.params.id);
    res.render('watchingspots/show', { ws });
}))

// GET /watchingspots/:id/edit : edit page to a watching spot
app.get('/watchingspots/:id/edit', catchAsync(async (req, res) => {
    const ws = await Watchingspot.findById(req.params.id);
    res.render('watchingspots/edit', { ws });
}))

// PUT /watchingspots/:id : submit edit
app.put('/watchingspots/:id', validateWS, catchAsync(async (req, res) => {
    const { id } = req.params;
    const ws = await Watchingspot.findByIdAndUpdate(id, { ...req.body.watchingspot });
    res.redirect(`/watchingspots/${ws._id}`);
}))

// DELETE /watchingspots/:id : submit delete request
// and redirect to the index page of watching spots
app.delete('/watchingspots/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Watchingspot.findByIdAndDelete(id);
    res.redirect('/watchingspots');
}))

app.post('/watchingspots/:id/reviews', catchAsync(async (req, res) => {
    const ws = await Watchingspot.findById(req.params.id);
    const review = new Review(req.body.review);
    ws.reviews.push(review);
    await review.save();
    await ws.save();
    res.redirect(`/watchingspots/${ws._id}`);
}))

// handle 404 not found error
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// handle other errors (e.g. ID not found)
app.use((err, req, res, next) => {
    // 500 and something went wrong is default code and message
    const { statusCode = 500 } = err;
    if (!err.message || statusCode === 500) {
        err.message = "Oops! Something went wrong :("
    }
    res.status(statusCode).render('error', { err });
})

// start listening on localhost port 3000
app.listen(3000, () => {
    console.log("Serving on port 3000.");
})
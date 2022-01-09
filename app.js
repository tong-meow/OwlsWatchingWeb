// require the framework and supporting tools
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

// require the routers
const watchingspots = require('./routes/watchingspots');
const reviews = require('./routes/reviews');

// connect to the mongo database
mongoose.connect('mongodb://localhost:27017/owls-watch');
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
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    ///////// temporary secret key!!!! //////////
    secret: 'asecretinstead',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // for security
        httpOnly: true,
        // set the coockies' expire date to a week
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash());


// middleware for the flash
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// use routes
app.use('/watchingspots', watchingspots);
app.use('/watchingspots/:id/reviews', reviews);

// GET / : homepage
app.get('/', (req, res) => {
    res.render('home');
})

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
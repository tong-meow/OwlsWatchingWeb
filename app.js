// require the framework and supporting tools
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// require the routers
const userRoutes = require('./routes/users');
const watchingspotsRoutes = require('./routes/watchingspots');
const reviewsRoutes = require('./routes/reviews');

// connect to the mongo database
mongoose.connect('mongodb://localhost:27017/owls-watch');
const db = mongoose.connection;
// handle database connection error
db.on("error", console.error.bind(console, "Database connection error:"));
// print connected message
db.once("open", () => {
    console.log("Database connected.");
});

const app = express();

// configuration for app, set ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware setting
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// sessions setting
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


// passport setting
app.use(passport.initialize());
app.use(passport.session());
// use passport local's authenticate method for user schema
passport.use(new LocalStrategy(User.authenticate())); 
// store and unstore method for user in database
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware for the flash
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// use routes
app.use('/', userRoutes);
app.use('/watchingspots', watchingspotsRoutes);
app.use('/watchingspots/:id/reviews', reviewsRoutes);

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
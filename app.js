const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Watchingspot = require('./models/watchingspot');

mongoose.connect('mongodb://localhost:27017/owls-watch');

// connect to the mongo database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database connection error:"));
db.once("open", () => {
    console.log("Database connected.");
});

const app = express();

// set ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

// GET / : homepage
app.get('/', (req, res) => {
    res.render('home');
})

// GET /watchingspots : all owls watching spots index
app.get('/watchingspots', async (req, res) => {
    const watchingspots = await Watchingspot.find({});
    res.render('watchingspots/index', { watchingspots });
})

// GET /watchingspots/new : add a new watching spot
app.get('/watchingspots/new', (req, res) => {
    res.render('watchingspots/new');
})

// POST /watchingspots : post the new watching spot
// and redirect to the index page of watching spots
app.post('/watchingspots', async (req, res) => {
    const ws = new Watchingspot(req.body.watchingspot);
    await ws.save();
    res.redirect(`/watchingspots/${ws._id}`);
})

// GET /watchingspots/:id : view one watching spot's information page
app.get('/watchingspots/:id', async(req, res) => {
    const watchingspot = await Watchingspot.findById(req.params.id);
    res.render('watchingspots/show', { watchingspot });
})

// start listening on localhost port 3000
app.listen(3000, () => {
    console.log("Serving on port 3000.");
})
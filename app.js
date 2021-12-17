const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
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
app.use(methodOverride('_method'));

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
    const ws = await Watchingspot.findById(req.params.id);
    res.render('watchingspots/show', { ws });
})

// GET /watchingspots/:id/edit : edit page to a watching spot
app.get('/watchingspots/:id/edit', async(req, res) => {
    const ws = await Watchingspot.findById(req.params.id);
    res.render('watchingspots/edit', { ws });
})

// PUT /watchingspots/:id : submit edit
app.put('/watchingspots/:id', async(req, res) => {
    const { id } = req.params;
    const ws = await Watchingspot.findByIdAndUpdate(id, { ...req.body.watchingspot });
    res.redirect(`/watchingspots/${ws._id}`);
})

// DELETE /watchingspots/:id : submit delete request
// and redirect to the index page of watching spots
app.delete('/watchingspots/:id', async(req, res) => {
    const { id } = req.params;
    await Watchingspot.findByIdAndDelete(id);
    res.redirect('/watchingspots');
})

// start listening on localhost port 3000
app.listen(3000, () => {
    console.log("Serving on port 3000.");
})
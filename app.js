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


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/watchingspots', async (req, res) => {
    const watchingspots = await Watchingspot.find({});
    res.render('watchingspots/index', { watchingspots });
})

app.get('/watchingspots/:id', async(req, res) => {
    const watchingspot = await Watchingspot.findById(req.params.id);
    res.render('watchingspots/show', { watchingspot });
})

app.listen(3000, () => {
    console.log("Serving on port 3000.");
})
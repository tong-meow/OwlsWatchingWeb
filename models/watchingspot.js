const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema for 'WatchingSpot'
const WatchingspotSchema = new Schema({
    title: String,
    location: String,
    typeOfOwl: String,
    bestTimeOfYear: String,
    description: String,
});

// exports the Watchingspot schema
module.exports = mongoose.model('Watchingspot', WatchingspotSchema);
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Watchingspot = require('../models/watchingspot');

mongoose.connect('mongodb://localhost:27017/owls-watch');

const db = mongoose.connection;

// connect to the mongo database
db.on("error", console.error.bind(console, "Database connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Watchingspot.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const spot = new Watchingspot({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'A lovely place for owls watching.',
            typeOfOwl: 'Great Horned Owls',
            // this author ID is only used for testing in seeds
            // the username is 'admin'
            author: '61e12faa1c3ad7288119d87f',
            geometry: {
              type: "Point",
              coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/owlstudio/image/upload/v1642387655/owls-watch/c5phbh9osr0dfcbtwrht.png',
                  filename: 'owls-watch/c5phbh9osr0dfcbtwrht',
                },
                {
                  url: 'https://res.cloudinary.com/owlstudio/image/upload/v1642386446/owls-watch/vfatvorlob7tc4nsklkl.jpg',
                  filename: 'owls-watch/vfatvorlob7tc4nsklkl',
                }
              ]
        })
        await spot.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
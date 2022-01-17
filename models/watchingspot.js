const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// create schema for pictures
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true }};

// create schema for 'WatchingSpot'
const WatchingspotSchema = new Schema({
    title: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    typeOfOwl: String,
    bestTimeOfYear: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

WatchingspotSchema.virtual('properties.popUpMarkup').get(function(){
    return `<h6><a href="/watchingspots/${this._id}" style="color:#00695C">${this.title}</a></h6>
    <p>${this.description.substring(0,40)}...</p>`
});

// query middleware:
// - when deleting a watching spot, we'll delete all reviews attached to it.
WatchingspotSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// exports the Watchingspot schema
module.exports = mongoose.model('Watchingspot', WatchingspotSchema);
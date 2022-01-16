// require models
const Watchingspot = require('../models/watchingspot');

module.exports.index = async (req, res) => {
    const watchingspots = await Watchingspot.find({});
    res.render('watchingspots/index', { watchingspots });
}

module.exports.renderNewForm = (req, res) => {
    res.render('watchingspots/new');
}

module.exports.createWS = async (req, res) => {
    // handle error if the body doesn't exist
    // if (!req.body.watchingspot) throw new ExpressError('Invalid Watchingspot Data', 400);
    const ws = new Watchingspot(req.body.watchingspot);
    ws.author = req.user._id;
    await ws.save();
    req.flash('success', 'Thank you! A new watching spot is successuly added!')
    res.redirect(`/watchingspots/${ws._id}`);
}

module.exports.displayWS = async (req, res) => {
    const ws = await Watchingspot.findById(req.params.id).populate({
        path:  'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    // if the id is not found, redirect to the index page
    // flash the error message
    if(!ws){
        req.flash('error', 'Oops, this watching spot is not found');
        return res.redirect('/watchingspots');
    }
    res.render('watchingspots/show', { ws });
}

module.exports.renderEditForm = async (req, res) => {
    const ws = await Watchingspot.findById(req.params.id);
    // if the id is not found, redirect to the index page
    // flash the error message
    if(!ws){
        req.flash('error', 'Oops, this watching spot is not found');
        return res.redirect('/watchingspots');
    }
    res.render('watchingspots/edit', { ws });
}

module.exports.updateWS = async (req, res) => {
    const { id } = req.params;
    const ws = await Watchingspot.findByIdAndUpdate(id, { ...req.body.watchingspot });
    req.flash('success', 'Thank you! The watching spot is successufully updated!')
    res.redirect(`/watchingspots/${ws._id}`);
}

module.exports.deleteWS = async (req, res) => {
    const { id } = req.params;
    await Watchingspot.findByIdAndDelete(id);
    req.flash('success', 'The watching spot is successufully deleted')
    res.redirect('/watchingspots');
}
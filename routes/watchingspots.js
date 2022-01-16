const express = require('express');
const router = express.Router();

// require middlewares
const { isLoggedIn, validateWS, verifyAuthor } = require('../middleware');

// require utils
const catchAsync = require('../utils/catchAsync');

// require controllers
const watchingspots = require('../controllers/watchingspots');


/******* Routers ******/

router.route('/')
    // GET /watchingspots : the index of all owls watching spots
    .get(catchAsync(watchingspots.index))
    // POST /watchingspots : post the new watching spot
    // and redirect to the index page of watching spots
    .post(isLoggedIn, validateWS, catchAsync(watchingspots.createWS));

// GET /watchingspots/new : create a new watching spot
router.get('/new', isLoggedIn, watchingspots.renderNewForm);

router.route('/:id')
    // GET /watchingspots/:id : view one watching spot's information page
    .get(catchAsync(watchingspots.displayWS))
    // PUT /watchingspots/:id : submit edit
    .put(isLoggedIn, verifyAuthor, validateWS, catchAsync(watchingspots.updateWS))
    // DELETE /watchingspots/:id : submit delete request
    // and redirect to the index page of watching spots
    .delete(isLoggedIn, verifyAuthor, catchAsync(watchingspots.deleteWS));

// GET /watchingspots/:id/edit : edit page of a watching spot
router.get('/:id/edit', isLoggedIn, verifyAuthor, catchAsync(watchingspots.renderEditForm));


// export this router
module.exports = router;
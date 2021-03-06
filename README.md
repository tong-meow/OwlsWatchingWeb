# Owls Watching Web
- This website allows users to search, share and comment wildlife (especially owls) watching places in USA.
- This website has a 'wiki' for the owl, and for owl watching.
- <b>I LOVE OWLS!</b>

<p align="center">
  <img src="https://centerofthewest.org/wp-content/uploads/2013/10/gho-2.jpg" width="500" alt="Cute Great Horned Owl">
</p>
<p align="center">
<i>Reference: Pic from <a href="https://centerofthewest.org/2013/10/15/my-favorite-facts-about-great-horned-owls/">Center of the West</a></i>
</p>


## Developer Diary
### 12/16/2021
- Initialized the project: import ejs, express, mongoose, method-override.
- Created the blank home page ("/home").
- Added (fake) seeds for owls watching spots ("/watchingspots").
- Added the index and show pages for watching spots ("/watchingspots/:id").
- Added edit page and delete request button for every watching spot ("/watchingspots/:id/edit").

### 12/17/2021
- Use bootstrap, added some basic style for the currently existed pages.

### 12/19/2021
- Added basic error handlers for 'POST' and 'PUT' request with Joi. If any required field is missing or is null, the error page with error messages shows up.
- Added basic error handlers for 404 not found error.
- Added handlers for other errors.

### 12/20/2021 - 1/10/2022
Christmas Holiday! Merry Christmas!

### 12/25/2021
- Added review part to every watching spot, created new review schema with rating and comment.
- Added review validating check.
- Added review deleting feature.
- Modified watching spot deleting feature: if a watching spot is deleted, remove all reviews that are attached to it.

### 1/9/2022
- Reformatted the project files. Created two routes (watchingspot and review), reformatted the app.js file.
- Added session and flash, so the success or error messages pop up now.
- Used the bootstrap to style the flash messages.

### 1/13/2022
- Imported Node.js middleware 'Passport'.
- Using passport, added user authentication to the project.
- Using sessions to keep track on a user's logging in status.
- Added register page, login page, and updated the nav-bar.
- Some pages require a logged in status to visit (e.g. add a new watching spot / edit a current watching spot / make comment).

### 1/15/2022
- Added authority checking for watching spots and reviews.
- Updated the model of Watchingspot and Review, added a field of author with a user id stored in database.
- Added feature to let only the 'already logged in' users to create a new watching spot or leave a review.
- Added feature to let only the author of a watching spot or a review can edit or delete her spot or review.
- Hided the edit / delete button for viewers who haven't logged in.

### 1/16/2022
- Restructured routes, added controller files.
- Set the environment and linked to Cloudinary cloud.
- Added features for photo uploading in /edit and /new.
- Added features for deleting photos in /edit.
- Automatically delete photos in both Mongo DB and Cloudinary when a user delete a photo or delete a whole watching spot.

### 1/17/2022
- Using Mapbox, added map to each watching spot.
- Added feature that when a new watching spot is created, automatically generate a map with a point on the target location.
- Added a cluster USA map on the index page. User can go into any watching spot with this map.
- Modified some pages' style.
- Added basic security checkings with Helmet.
- Linked the application to a cloud database Mongo Atlas.
- Delopyed the application on Heroku.

### The very first version 1.0.0
view it here: <a href='https://lit-inlet-00226.herokuapp.com/'>OwlsWatching</a>

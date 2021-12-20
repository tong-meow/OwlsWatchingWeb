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

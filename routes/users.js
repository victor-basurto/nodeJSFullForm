var express = require('express');
var router = express.Router();

/**
 * In this section we will going to have all the users views
 * for example: if the user goes to Register, from here we are 
 * going to handle the event to render that view under users
 * the sme on login, because it is part of the users, the login
 * view will be display under users/login
 */

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// when the user go to register e.g. users/register
router.get('/register', function( req, res, next ) {
  res.render('register', {
  	'title': 'Register'
  });
});

// when the user go to login e.g. users/login
router.get('/login', function( req, res, next ) {
  res.render('login', {
  	'title': 'Login'
  });
});

/* POST users listing */
// specify where to put content
router.post('/register', function( req, res, next ) {
	// get form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// check for image field
	if( req.files.profileimage ) {
		console.log('Uploading Files');

		// file info
		var profileImageOriginalName = req.files.profileimage.originalname;
		var profileImageName         = req.files.profileimage.name;
		var profileImageMime         = req.files.profileimage.mimetype;
		var profileImagePath         = req.files.profileimage.path;
		var profileImageExt          = req.files.profileimage.extension;
		var profileImageSize         = req.files.profileimage.size;
	} else {
		// in case they dont upload a file
		// set a default image
		var profileImageName = 'noimage.png';
	}

	// form validation
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Email not valid').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	//check for Errors
	var errors = req.validationErrors();

	// if there are errors on the page
	// load register again and pass errors object
	// once the page is loaded, render the name, email
	// username, password
	if( errors ) {
		res.render('register', {
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
		return;
	} else {
		//  pass new user data
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileimage: profileImageName
		});

		// create new user and pass the newUser object we just created
		// User.createUser(newUser, function( err, user ) {
		// 	if(err) throw err;
		// 	console.log(user);
		// });

		// success message
		req.flash('success', 'You are now registered and may log in');

		res.location('/');
		res.redirect('/');
		res.render('/register');
	}

});


module.exports = router;

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// stablish connection to db
mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

/**
 * Define User Schema
 */
var UserSchema = mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String
	},
	username: {
		type: String,
		index: true
	},
	password: {
		type: String,
		require: true,
		bcrypt: true
	},
	profileimage: {
		type: String
	}
});

/**
 * Make this Object available outside this file
 */
var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function( candidatePassword, hash, callback ) {
	bcrypt.compare(candidatePassword, hash, function( err, isMatch ) {
		if( err ) return callback(err);
		callback(null, isMatch);
	});
}

/**
 * Get ID
 */
module.exports.getUserById = function( id, callback ) {
	User.findById(id, callback);
}

/**
 * Get User
 */
module.exports.getUserByUsername = function( username, callback ) {
	var query = {
		username: username
	};
	User.findOne(query, callback);
}

/**
 * Create a new user
 */
module.exports.createUser = function( newUser, callback ) {
	bcrypt.hash(newUser.password, 10, function( err, hash ) {
		if( err ) {
			throw err;
		}
		// set hashed password
		newUser.password = hash;
		// create user
		newUser.save(callback);
	});
}

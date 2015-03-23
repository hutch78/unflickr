//pull in our controllers
var home = require('../controllers/home');
var image = require('../controllers/image');
var flash = require('connect-flash');
var users = require('../controllers/user');
var passport = require('passport');

module.exports.initialize = function(app, router) {
	//handles browser requests for images
	app.get('/', home.index);
	app.get('/images/:image_id', image.index);
	
	//handles post routes (like a form submission)
	app.post('/images', image.create);
	app.post('/images/:image_id/like', image.like);
	app.post('/images/:image_id/comment', image.comment);
	app.post('/images/:image_id/remove', image.destroy);
	
	app.use('/', router);

	app.get('/flash', function(req, res){
	  // Set a flash message by passing the key, followed by the value, to req.flash().
	  req.flash('info', 'Flash is back!')
	  res.redirect('/');
	});


	/* =- =- -= -= =-=-- =- -= -= =-=-- =- -= -= =-=-- =- -= -= =-=-

		Added from Salter FIle:
			our new routes handle the sign up
			and sign in views and actions

	=- -= -= -= =- = -= = -= - =- = -=- -= =- =- =- = -*/
	app.get('/signup', users.renderSignup);
	app.post('/signup', users.signup);
	app.route('/signin')
		.get(users.renderSignin)
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/signin',
			//*****displays an error message or welcome depending on authentication
			failureFlash: true,
            successFlash: 'Test Success Message'
		}));
	app.get('/signout', users.signout);


};
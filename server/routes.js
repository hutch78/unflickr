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

	// GET /auth/facebook
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  The first step in Facebook authentication will involve
	//   redirecting the user to facebook.com.  After authorization, Facebook will
	//   redirect the user back to this application at /auth/facebook/callback
	app.get('/auth/facebook',
	  passport.authenticate('facebook', { scope : 'email' }),
	  function(req, res){

	  	console.log(req);
	  	console.log(res);

	    // The request will be redirected to Facebook for authentication, so this
	    // function will not be called.
	  });

	// GET /auth/facebook/callback
	//   Use passport.authenticate() as route middleware to authenticate the
	//   request.  If authentication fails, the user will be redirected back to the
	//   login page.  Otherwise, the primary route function function will be called,
	//   which, in this example, will redirect the user to the home page.
	app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { failureRedirect: '/login' }),
	  function(req, res) {

	  	console.log(req);
	  	console.log(res);

	    res.redirect('/');
	  });

	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});


	// Simple route middleware to ensure user is authenticated.
	//   Use this route middleware on any resource that needs to be protected.  If
	//   the request is authenticated (typically via a persistent login session),
	//   the request will proceed.  Otherwise, the user will be redirected to the
	//   login page.
	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect('/login')
	}
};
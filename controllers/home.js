//takes the browser's request and lets us send back a page or other information
var imageModel = require('../models').Image;
var stats  = require('../helpers/stats');
var latest_comment  = require('../helpers/latest_comment');

module.exports = {

	index: function(req, res) {

		// returns user on successful login and redirect
		console.log('\nhome.index: Req.user:');
		console.log(req.user);
		console.log('\n');
		
		var viewModel = {
			images: {},
			sidebar: {},
			latest_comment: {},
			userName: req.user ? req.user.username : '',
			messages: req.flash('info') || req.flash('success')
		}

		imageModel.find(function(err, images) {

			viewModel.images = images;

			stats(viewModel, function(viewModel){
				latest_comment(viewModel, function(viewModel){

					console.log('\nhom.index userName:');
					console.log(viewModel.userName);
					console.log('\n');

					console.log('\nhom.index messages:');
					console.log(viewModel.messages);
					console.log('\n');


					res.render('index', viewModel);
				})
			})
        	
        });

	}
};
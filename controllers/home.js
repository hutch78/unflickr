//takes the browser's request and lets us send back a page or other information
var imageModel = require('../models').Image;
var stats  = require('../helpers/stats');
var latest_comment  = require('../helpers/latest_comment');

module.exports = {

	index: function(req, res) {

		
		var viewModel = {
			images: {},
			sidebar: {},
			latest_comment: {}
		}

		imageModel.find(function(err, images) {

			viewModel.images = images;

			stats(viewModel, function(viewModel){
				latest_comment(viewModel, function(viewModel){

					// console.log(viewModel);

					res.render('index', viewModel);
				})
			})
        	
        });

	}
};
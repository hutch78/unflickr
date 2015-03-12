var Models = require('../models'),
	async = require('async'),
	md5 = require('MD5');

module.exports = function(viewModel, callback){

	console.log('latest_comment reached');

	Models.Comment.find()
		.sort({timestamp: -1})
		.limit(1)
		.exec(function(err, latest_comment){
			if(err){
				console.log(err)
			} else {

				latest_comment = latest_comment[0];


				viewModel.latest_comment = latest_comment;

				callback(viewModel);

				console.log(viewModel);

			}
		});
		

	

}
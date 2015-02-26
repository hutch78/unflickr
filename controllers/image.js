var fs = require('fs');
var path = require('path');
var Models = require('../models');

//handles all requests for our image app
module.exports = {
	index: function(req, res) {

		var viewModel = {
			image: {},
			comment: {}

		};


		//find the image using the url 
		Models.Image.findOne({ filename: { $regex: req.params.image_id } },
			function (err, image) {
				if (err) { throw err; }
				if (image) {

					// console.log(image);

					//if found, adds to views
					image.views++;

					//saves the image to use as the view
					viewModel.image = image;

					Models.Comment.findOne({},function(err, comment){
						if(comment){
							viewModel.comment = comment;
							console.log(viewModel);
						} else {
							console.log('no comment found...')
						}
					});

					// Models.Comment.find({ image_id: req.params.image_id },
					// 	function(err, comments){
					// 		if(err){
					// 			console.log(err)
					// 		} else {

					// 			// console.log('\nThe Comments:\n');
					// 			// console.log(comments);
					// 			// console.log('\n\n');


					// 			viewModel.comments = comments;
					// 			console.log(comments.length+' comments found');


					// 			 =- =- =- =- =- -= -= =- - =- =- -= = -= - =- =- =- =- = -= -= =- = -= - = -= - =-= 

					// 				Start by passing only one image at a time and see if the view can access it

					// 			 =- =- =- =- =- -= -= =- - =- =- -= = -= - =- =- =- =- = -= -= =- = -= - = -= - =-= 


					// 			console.log(typeof(comments));


					// 			// console.log(viewModel);


					// 		}
					// 	});

					//save the updated model
					// image.save();

					res.render('image', viewModel);

				} else {

					//if no image, return to index
					res.redirect('/');

				}
			});
		},
	create: function(req, res) {
		var saveImage = function() {
			//info for creating a unique identifier
			var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                imgUrl = '';
			
			//generates the id
            for(var i=0; i < 6; i+=1) {
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }
			//checks to see if there's an image with this filename
			Models.Image.find({ filename: imgUrl }, function(err, images) {
				if (images.length > 0) {
					//if there's a match, make a different name
					saveImage();
				} else {
					//creates the path for storing the image
					var tempPath = req.files.file.path,
						ext = path.extname(req.files.file.name).toLowerCase(),
						targetPath = path.resolve('./public/upload/' + imgUrl + ext);
					//checks to make sure we're getting an image, then stores it if valid
					if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
						fs.rename(tempPath, targetPath, function(err) { 
							if (err) { 
								throw err; 
							}
							//creates the image model with details from the request (req)
							var newImg = new Models.Image({
								title: req.body.title,
								filename: imgUrl + ext,
								description: req.body.description
							});
							//saves the image - mongoose function
							newImg.save(function(err, image) {
								console.log('Successfully inserted image: ' + image.filename);
								res.redirect('/images/' + imgUrl);
							});
					});
					} else {
						fs.unlink(tempPath, function () {
							if (err) {
								throw err;
							}

							res.json(500, {error: 'Only image files are allowed.'});
						});
					}
				}
			});
		};	
		saveImage();
	},
	like: function(req, res) {
		console.log(req);

		var viewModel = {
			image: {}
		};
		//find the image using the url 
		Models.Image.findOne({ filename: { $regex: req.params.image_id } },
			function (err, image) {
				if (err) { throw err; }
				if (image) {

					//if found, adds to likes
					image.likes++;

					//update the image model
					viewModel.image = image;
					//save the updated model
					image.save();

					res.render('image',viewModel);
					
				} else {
					//if no image, return to index

					console.log('\nImage Not FOund Bro!\n');
					res.redirect('/');
				}
			});
	},
	comment: function(req, res) {
		
		// console.log(req.body);
		// console.log(req.params.image_id);

		var saveComment = function(){

			//creates the image model with details from the request (req)
			var newComment = new Models.Comment({
				image_id: req.params.image_id,
				comment: req.body.comment,
				name: req.body.name,
				email: req.body.email
			});

			//saves the image - mongoose function
			newComment.save(function(err, comment) {
				if (err) { 
					throw err; 
				} else {
					console.log('Successful Comment');
					res.redirect('/images/'+newComment.image_id);
				}
			});
		}

		//  Call the function above
		saveComment();


	}
};
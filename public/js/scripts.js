jQuery(document).ready(function($){

	$('.like-form').on('submit', function(evt){

		evt.preventDefault();

		var image_id = $(this).data('id');
		var num_likes = parseInt($('#num-likes').html());
		num_likes++;
		$('#num-likes').html(num_likes);

		var request_url = '/images/'+image_id+'/like/';

		$.post(request_url, function(data, textStatus){

			console.log(data);

		});

	});

	$('.remove-image').on('click', function(evt){

		evt.preventDefault();

		var ajax_url = $(this).data('ajax-url');
		var image_id = $(this).data('image-id');
		var image = $(this).parent('.a-tile');

		if(ajax_url){
			console.log(ajax_url);
		}

		$.post(ajax_url, {id: image_id}, function(data, textStatus){

			console.log(data);

			if(data.num_images > 0){

				image.fadeOut(500, function(){
					image.remove();
					if($('.a-tile').length == 0){
						$('#home-gallery').fadeOut(500, function(){
							$('#home-gallery').remove();
						});
					}
				});

			}

		});


	});

	if($('#flash-bar .error') || $('#flash-bar .messages')){
		setTimeout(function() {
			$('#flash-bar').addClass('shown');
			setTimeout(function() {
				$('#flash-bar').removeClass('shown');
			}, 5000);
		}, 500);
	}

});
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

});
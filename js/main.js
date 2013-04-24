$(document).ready(function(){ 

	$('#content-wrapper').css('display','block');

$(window).resize(function() {
});

//top links navigate
$('.page-link').click(function(event) {
	var that = $(event.target);
	var link = that.attr("rel");
	$('html, body').animate({
		scrollTop: $(link).offset().top
}, 1000, 'easeOutCubic');
});

function centerItem() {
	$('.centered').each(function() {
	  var itemH =  $(this).height(),
 	      itemW =  $(this).width();	
	  $(this).css({ 'top' : (window.innerHeight / 2) - (itemH / 2)  });
	  $(this).css({ 'left' : (window.innerWidth / 2) - (itemW / 2)  });
	});
};

// end JS
});
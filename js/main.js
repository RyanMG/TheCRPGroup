$(document).ready(function(){ 

  $('#content-wrapper').css('display','block');

	$('#page-1').css({ height: $(window).height(), width: $(window).width() }); 

	// UI click to scroll to
	$('nav').on('click', '.nav-icon', function(event) {
	   var link = $(event.target).attr("rel");
		$('html, body').animate({
			scrollTop: $(link).offset().top
		}, 1000, 'easeOutCubic');
	}); // page link

	$('#page-1').on('click', '#page-1-theatrical, #page-1-homeEnt, #page-1-gaming', function(){
		$('html, body').animate({
			scrollTop: $('#portfolio').offset().top
		}, 1000, 'easeOutCubic');
	});


});// doc ready

$(window).scroll(function(){
	var $scrollTop = $(window).scrollTop(),
		$height = $(window).height();	
	// hide or show nav bar
	if ($scrollTop > $height) {
		$('nav').css({position: 'fixed', top: '0px'});
	}
	if ($scrollTop <= $height) {
		$('nav').css({position:'relative'});
	}

});

$(window).resize(function() {
	$('#page-1').css({ height: $(window).height(), width: $(window).width() }); 
});
$(document).ready(function(){ 

	$('#content-wrapper').css('display','block');
	  var
	   currentPos = 0,
	   winH = $(window).height(),
	   winW = $(window).width();
	 console.log(winH);
	setWinSize(winH, winW);
	centerItem();
	setTimeout( function() {
		$('#crp-logo').fadeIn(1400, function() {
		  $('#down-button').fadeTo(500, 0.25);
		})
	},100 );

$(window).resize(function() {
	var
 	  winH = $(window).height(),
      winW = $(window).width();
	setWinSize(winH, winW);
	centerItem();
});

// fade up and down button in and out
$('.nav-button').hover(function(){
	$(this).stop().fadeTo(1000, 1);
}, function() {
	$(this).stop().fadeTo(1000, 0.25);
});

// set each page to be the current window H X W
function setWinSize(winH, winW){
	var i=0;
	$('section').each(function(){
		$(this).css({ 'height' : winH });
		$(this).css({ 'width' : winW });	
		$(this).css({ 'top' : i });
		i += winH;
	});
};

//top links navigate
$('.page-link').click(function(event) {
	var that = $(event.target);
	var link = that.attr("href");
	$('html, body').animate({
		scrollTop: $(link).offset().top
}, 1000, 'easeOutCubic');
});

// fade up and down buttons in or out based on scroll position
$(window).scroll(function(){
	var
	  scrollPos = $(window).scrollTop(),
	  wrapH = $(document).height();
	  console.log(winH);
	if (scrollPos >= winH - (winH * .05) && scrollPos + winH !== wrapH ) {
		$('header').fadeIn('600');
		$('#up-button').fadeIn('400');
        $('#down-button').fadeIn('400');
        $('footer').slideUp(500);
	} else if (scrollPos < winH) {
		$('header').fadeOut('600');
		$('#up-button').fadeOut('400');
        $('#down-button').fadeIn('400');
        $('footer').slideUp(500);
	} else if (scrollPos + winH == (wrapH+100)) {
       $('#down-button').fadeOut('400');
       $('footer').stop().slideDown(500);
   }
});

//up ad down buttons move page
$('#down-button').click(function() {
	$('html, body').animate({
		scrollTop: $("#page-2").offset().top
}, 1000, 'easeOutCubic');
});

$('#up-button').click(function() {
	$('html, body').animate({
		scrollTop: $("#page-1").offset().top
}, 1000, 'easeOutCubic');
});

// center CRP logo on main page
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
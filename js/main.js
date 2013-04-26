var pagePosition = {
	leftPos : 1,
	topPos : 1,
}

$(document).ready(function(){ 

	$('#content-wrapper').css('display','block');
	setWinSize();
	centerItem();
	setTimeout( function() {
		$('#crp-logo').fadeIn(1000, function() {
			$('header').fadeIn();
			$('#upDownNav').fadeIn();
		})
	},100 );

$(window).resize(function() {
		setWinSize();
		centerItem();

		// make horizontal pages not overlap on resize
		$('section').each(function(){
			i=0;
			$(this).children().each(function(){
				$(this).css({'margin-left' : i });
				i += $(window).width();
			});
		});
		// resize header to fit on resize when opened
		if ($('#click-area').data('opened') === 1) {
			$('#header-ul').css({ 'width' : $(window).width() - 60 });
			$('header').css({ 'width' : $(window).width() - 20 });
		};

		// keep current page pinned to top
		var newPage = "#page-" + pagePosition.topPos;
		$('html, body').animate({
				scrollTop: $(newPage).offset().top
		}, 0);
});

// set each page to be the current window H X W
function setWinSize(){
	if ($(window).height() > 650) {
		var i=0;
		$('section').each(function(){
			$(this).css({ 'height' : $(window).height() });
			$(this).css({ 'top' : i });
			i += $(window).height();
		});
   } else if($(window).height() <= 650) {
   		var i=0;
		$('section').each(function(){
			$(this).css({ 'height' : 650 });
			$(this).css({ 'top' : i });
			i += 650;
		});
   }
   if ($(window).width() > 1200) {
   	$('section').each(function() {
   		$(this).css({ 'width' : $(window).width() });	
	});
   } else {	
	$('section').each(function() {
		$(this).css({ 'width' : 1200 });
    });
   };	
};

// center shit
function centerItem() {
	$('.centered').each(function() {
	  var itemH =  $(this).height(),
 	      itemW =  $(this).width();	
	  $(this).css({ 'top' : ($(window).height() / 2) - (itemH / 2)  });
	  $(this).css({ 'left' : ($(window).width() / 2) - (itemW / 2)  });
	});

	$('.centeredV').each(function() {
	  var itemH =  $(this).height();
	  $(this).css({ 'top' : ($(window).height() / 2) - (itemH / 2)  });
	});

	$('.centeredH').each(function() {
	  var itemW =  $(this).width();	
	  $(this).css({ 'left' : ($(window).width() / 2) - (itemW / 2)  });
	});
	if ($(window).height() > 668) {
		$('#about-wrapper').css({ 'top' : ( (($(window).height() * .8) / 2) - 250) });
	} else {
		$('#about-wrapper').css({ 'top' : 20 });		
	}
};

// reset any horizontal pages
function resetHor() {
	if ($('.current-page').data('which') && pagePosition.leftPos > 1 ) {
		var i = $('.current-page').children().length,
				curSection = $('.current-page').data('which'),
		    j = 1;
			do {
			  var thisPage = '#' + curSection + "-" + j,
			      newMargin = parseInt($(thisPage).css('margin-left').replace('px','')) + ( $(window).width() * (pagePosition.leftPos - 1) ); 
			  console.log( parseInt($(thisPage).css('margin-left').replace('px','')) );
			  console.log( $(window).width() * (i-1) );
			  $(thisPage).animate({ 'margin-left' : newMargin },600, 'easeOutCubic' );
  			  j += 1;
			} while (j <= i);

			pagePosition.leftPos = 1;
	  $('#left-button').fadeOut(400);
	  $('#right-button').fadeIn(400);
	};
}

//top links navigate
$('.page-link').click(function(event) {
	
	resetHor();
	  $('.current-page').removeClass('current-page');
 	  var link = $(event.target).attr("rel");
      pagePosition.topPos = $(event.target).data('page');
	$('html, body').animate({
		scrollTop: $(link).offset().top
	}, 1000, 'easeOutCubic');
	if (pagePosition.topPos === 1) {
		$('#up-button').fadeOut(1000);
		$('#down-button').fadeIn(1000);
	} else if (pagePosition.topPos === 7) {
		$('#up-button').fadeIn(1000);
		$('#down-button').fadeOut(1000);
	} else {
		$('#up-button').fadeIn(1000);
 		$('#down-button').fadeIn(1000);
	};

	$(link).addClass('current-page');
	if (pagePosition.topPos >= 3 && pagePosition.topPos <= 6) {
		$('#leftRightNav').fadeIn(300);
	} else {
		$('#leftRightNav').fadeOut(300);
	};
});

//up ad down buttons move page
$('#down-button').click(function() {
	resetHor();
	$('.current-page').removeClass('current-page');
	if (pagePosition.topPos !== 7) {
		pagePosition.topPos += 1;
		var newPage = "#page-" + pagePosition.topPos;
		$('html, body').stop().animate({
			scrollTop: $(newPage).offset().top
		}, 1000, 'easeOutCubic');
	};
	$(newPage).addClass('current-page');
	if (pagePosition.topPos !== 1 && pagePosition.topPos !== 7) {
		$('#up-button').fadeIn(300);
	} else if (pagePosition.topPos === 7) {
		$('#down-button').fadeOut(300);
	};
	if (pagePosition.topPos >= 3 && pagePosition.topPos <= 6) {
		$('#leftRightNav').fadeIn(300);
	} else {
		$('#leftRightNav').fadeOut(300);
	};
});

$('#up-button').click(function() {
	resetHor();
	$('.current-page').removeClass('current-page');
	if (pagePosition.topPos !== 1 ) {
		pagePosition.topPos -= 1;
		var newPage = "#page-" + pagePosition.topPos;
		$('html, body').stop().animate({
			scrollTop: $(newPage).offset().top
		}, 1000, 'easeOutCubic');
	};
	$(newPage).addClass('current-page');
	if (pagePosition.topPos !== 7 && pagePosition.topPos !== 1) {
		$('#down-button').fadeIn(300);
	} else if (pagePosition.topPos === 1) {
		$('#up-button').fadeOut(300);
	};
	if (pagePosition.topPos >= 3 && pagePosition.topPos <= 6) {
		$('#leftRightNav').fadeIn(300);
	} else {
		$('#leftRightNav').fadeOut(300);
	};
});

// LEFT AND RIGHT BUTTONS
$('#left-button').click(function() {
 if (!$(this).parent().children().is(':animated')) { // only allow the animation if a previous animation is done 
	var i = $('.current-page').children().length, // number of articles
	    curSection = $('.current-page').data('which'), // section type
	    j = 1;
	
	if (pagePosition.leftPos !== 1 ) {
	   	$('#left-button').fadeIn(400);
	   	$('#right-button').fadeIn(400)
        pagePosition.leftPos -= 1;
	        if (pagePosition.leftPos === 1){
	        	$('#left-button').fadeOut(400);
	        } else {
	        	$('#left-button').fadeIn(400);
	        };
		do {
			var thisPage = '#' + curSection + "-" + j,
			newMargin = parseInt($(thisPage).css('margin-left').replace('px','')) + window.innerWidth;

			$(thisPage).animate({ 'margin-left' : newMargin },1000, 'easeOutCubic' );
			j += 1;
		} while (j <= i);
	};
  };
});

$('#right-button').click(function() {
   if (!$(this).parent().children().is(':animated')) { // only allow the animation if a previous animation is done 
	var i = $('.current-page').children().length, // number of articles
	    curSection = $('.current-page').data('which'), // section type
	    j = 1;
	if (pagePosition.leftPos !== i ) {
        	$('#right-button').fadeIn(400);
        	$('#left-button').fadeIn(400);
        pagePosition.leftPos += 1;
        	if (pagePosition.leftPos === i){
	        	$('#right-button').fadeOut(400);
	        };
        do{
			var thisPage = '#' + curSection + "-" + j,
				newMargin = parseInt($(thisPage).css('margin-left').replace('px','')) - window.innerWidth;
			$(thisPage).animate({ 'margin-left' : newMargin },1000, 'easeOutCubic' );
			j += 1;
		} while (j <= i);
	};
  };
});

// Animate header
$('#click-area').click(function() {
  var opened = $('#click-area').data('opened'),
  	rightEdge = $(window).width() - 20;
  	ulWidth = $(window).width() - 60;

  if ( opened === 0 ) {
	$('#click-area').data('opened', 1);
	$('#header-ul').css({ 'width' : ulWidth });
	$('header').animate({
		width: rightEdge,
		backgroundColor: "#2a4e7c",
	}, 500, function() {
		 $('.plus').replaceWith('<span class="minus unselectable">-</span>')
	}); // closes animate
  
  } else {
	$('#click-area').data('opened', 0);
	$('header').animate({
		width: "40px",
		backgroundColor: "#fff",
	}, 500, function() {
		 $('.minus').replaceWith('<span class="plus unselectable">+</span>')
	}); 
  };
}); // closes click function

// call to rotate images
$('[data-rotate!=""]').each(function() {
	var deg = $(this).data('rotate');
	 	$(this).css( 'transform', 'rotate('+ deg + 'deg)' )
		$(this).css( '-ms-transform', 'rotate('+ deg + 'deg)' )
		$(this).css( '-moz-transform', 'rotate('+ deg + 'deg)' )
		$(this).css( '-webkit-transform', 'rotate('+ deg + 'deg)' )
});

// read arrow key presses
//    left = 37 up = 38 right = 39 down = 40
//document.onkeydown = function(evt) {
//    evt = evt || window.event;
//    switch (evt.keyCode) {
 //       case 37:
 //           leftArrowPressed();
 //           break;
//        case 39:
//            rightArrowPressed();
//            break;
//    }
// };

// disable arrow keys for now
var arrow_keys_handler = function(e) {
    switch(e.keyCode){
        case 37: case 39: case 38:  case 40: // Arrow keys
        case 32: e.preventDefault(); break; // Space
        default: break; // do not block other keys
    }
};
window.addEventListener("keydown", arrow_keys_handler, false);

// end JS
});
// ABOUT US IMAGES ARE LISTED BELOW
var img1Array = ['images/gallery-about/about-1-1.jpg','images/gallery-about/about-1-2.jpg','images/gallery-about/about-1-3.jpg'],
	img2Array = ['images/gallery-about/about-2-1.jpg','images/gallery-about/about-2-2.jpg','images/gallery-about/about-2-3.jpg'],
	img3Array = ['images/gallery-about/about-3-1.jpg','images/gallery-about/about-3-2.jpg','images/gallery-about/about-3-3.jpg'];

var pageMeasure = { // cache to keep from recalculating except on resize
	$height: $(window).height(), 
	$bottom: 0
};

$(document).ready(function(){ 

  aboutUsCycle(); // initiate the page cycling on About Us

  $('#content-wrapper').css('display','block');

	$('#page-1').css({ height: $(window).height(), width: $(window).width() }); 
	$('#portfolio').css({ minHeight: $(window).height(), width: $(window).width() }); 
	$('#about-us').css({ height: $(window).height(), width: $(window).width() }); 

	// UI click to scroll to
	$('nav').on('click touchstart', '.nav-icon', function(event) {
	   event.preventDefault();
	   var link = $(event.target).attr("rel");
		$('html, body').stop().animate({
			scrollTop: $(link).offset().top
		}, 1000, 'easeOutCubic');
		return false;		
	}); // page link

	$('body').on('click doubletap', '#page-1-theatrical, #page-1-homeEnt, #page-1-gaming, #crp-logo', function(){
 	 		thisTop = ($(window).width() > 767) ? 'nav' : '#portfolio'; 
 	 		$('html, body').stop().animate({
				scrollTop: $(thisTop).offset().top
			}, 1000, 'easeOutCubic');
		return false;
	});

	// BACKBONE 

	 var masterProjectList, lastProject;
	  $.getJSON('source/masterProjectList.json', function(data) {
		lastProject = parseInt(data[data.length - 1]['id']); // get ID of last project
		masterProjectList = new ProjectList(data);
		var masterListing = new ProjectListView();
		var masterModelListing = new ProjectModelListView();
	      pageOneCycle(data);
	  });

	  var Project = Backbone.Model.extend({
	    defaults: { }
	  });

	  var ProjectList = Backbone.Collection.extend({
	    model: Project,
	  });

	  var ProjectModelView = Backbone.View.extend({
	  	tagName: "div",
	  	className: "model-wrap",
	  	events: {
	  		'click .close-button' : 'closeModel',
	  		'touchstart .close-button' : 'closeModel',
	  		'click .model-left-arrow' : 'pageLeft',
	  		'touchstart .model-left-arrow' : 'pageLeft',
	  		'click .model-right-arrow' : 'pageRight',
	  		'touchstart .model-right-arrow' : 'pageRight',
	  		'click .poster, .videoClicker' : 'clickToPlayVideo',
	  		'touchstart .poster, .videoClicker' : 'clickToPlayVideo'
	  	},
	  	initialize: function() {
	  		this.template = _.template($(this.options.templ).html());
	  	},
	  	render: function(){
	  		$('#model-mask').on('click touchstart', this.closeModel);
	  		this.$el.html(this.template(this.model.toJSON()));
	  		return this;
	  	},
	  	closeModel: function(){
			$('.model-frame').fadeOut('500');
			$('#model-mask').fadeOut('500');
	 		return false;
	  	},
	  	pageLeft: function(){
			var $this = this.$el.find('.model-frame');
			var id = parseInt($this.attr('rel'));
			if (id === 1) { 
				id = lastProject;
				$('.model-frame[rel="' + id +'"]').fadeIn('1500', function(){
					$($this).hide();
				});

			} else {
				id--;
				$('.model-frame[rel="' + id +'"]').show();
				$($this).fadeOut('1500');
			}
			this.pauseVideos();
			return false;		
	  	},
	  	pageRight: function() {
			var $this = this.$el.find('.model-frame');
			var id = parseInt($this.attr('rel'));
			if (id === lastProject) { 
				id = 1;
				$('.model-frame[rel="' + id +'"]').show();
				$($this).fadeOut('1500');

			} else {
				id++;
				$('.model-frame[rel="' + id +'"]').fadeIn('1500', function(){
					$($this).hide();
				});
			}
			this.pauseVideos();
			return false;		
	  	},
	  	pauseVideos: function() { // pauses videos when switching pages
			$('video').each(function(){
				if (!this.paused) {
					this.pause();	
				}
			});
		},
		clickToPlayVideo: function(e){
			var $target = $(e.target);
			var $this = ($target.hasClass('fullArt')) ? $target : $target.parent();
			var $that = $this.parent().find('.video');
			if ($this.hasClass('poster')) {
				$this.css({'display': 'none'});
				$that.css({'display': 'block'});
				$that.children().get(1).play();
			} else if ($this.hasClass('video') && !$that.children().get(1).paused) {
				$that.children().get(1).pause();
			} else {
				$that.children().get(1).play();
			}
			return false;
		}
	  });

  	  var ProjectView = Backbone.View.extend({
	    tagName: "div", // this is unnecessary here as the default element is a div
	    className: "project-wrap",
	    initialize: function () {
	        this.template = _.template($('#projectTemplate').html());
	    },
	    render: function () {
	        this.$el.html(this.template(this.model.toJSON()));
	        return this;
	    },
	    events: {
	    	'click .theatrical-box, .homeEnt-box, .gaming-box' : "openModel",
	    	'doubletap .theatrical-box, .homeEnt-box, .gaming-box' : "openModel"
	    },
	    openModel: function() {
	    	var $this = this.$el.find('div').attr('rel');
			$('#model-mask').fadeIn('800');
			$('.model-frame[rel="' + $this +'"]').fadeIn('800');
			return false;		
		}
	  });

 	  var ProjectModelListView = Backbone.View.extend({
	  	el: '#modelList',
	    initialize: function() {
	      this.collection = masterProjectList;
	      this.render();
	    },
	    render: function() {
	      this.$el.html("");
	      this.collection.each(function(project) {
		        this.renderItem(project);
	      }, this);
	    },
	    renderItem: function(project) {
	      var isVideo = project.get('video');
	      if (isVideo == "true") {	
	    	var projectModelView = new ProjectModelView({ model: project, templ: '#videoProjectModel' });
	      	this.$el.append(projectModelView.render().el);
	      } else {
	      	var projectModelView = new ProjectModelView({ model: project, templ: '#projectModel'});
	      	this.$el.append(projectModelView.render().el);
	      }
	    }
	  });

	  var ProjectListView = Backbone.View.extend({
	  	el: '#projectList',
	    initialize: function() {
	      this.collection = masterProjectList;
	      this.render();
	    },
	    render: function() {
	      this.$el.html("");
	      this.collection.each(function(project) {
		        this.renderItem(project);
	      }, this);
	    },
	    renderItem: function(project) {
	      var projectView = new ProjectView({ model: project });
	      this.$el.append(projectView.render().el);
	    }
	  });

});// doc ready

function pageOneCycle(data) {
	var theatArray = [], homeEntArray = [], gamingArray = [],
		theatPos = 0, homeEntPos = 0, gamingPos = 0;

	_.each(data, function(proj){
		switch (proj.projectType) {
			case "Theatrical":
				theatArray.push(proj.mainImg);
				break;
			case "Home Entertainment":
				homeEntArray.push(proj.mainImg);
				break;
			case "Interactive Gaming":
				gamingArray.push(proj.mainImg);
				break;	
		}
	});

	$('#page-1-theatrical > img').attr('src', theatArray[0]);
	$('#page-1-homeEnt > img').attr('src', homeEntArray[0]);
	$('#page-1-gaming > img').attr('src', gamingArray[0]);
	cycleTheatrical();

	function cycleTheatrical(){
		setTimeout(function(){
			(theatPos < (theatArray.length-1)) ? theatPos+=1 : theatPos = 0;
			$('#page-1-theatrical').append("<img src='" + theatArray[theatPos] + "' class='project-img' style='display:none'>");
			$('#page-1-theatrical > img:last').fadeTo(1500, 1, function(){
				$('#page-1-theatrical > img:first').remove();
			});
			cycleHomeEnt();
		}, 3000);
	};
	function cycleHomeEnt(){
		setTimeout(function(){
			(homeEntPos < (homeEntArray.length-1)) ? homeEntPos+=1 : homeEntPos = 0;
			$('#page-1-homeEnt').append("<img src='" + homeEntArray[homeEntPos] + "' class='project-img' style='display:none'>");
			$('#page-1-homeEnt img:last').fadeTo(1500, 1, function(){
				$('#page-1-homeEnt > img:first').remove();
			});
			cycleGaming();
		}, 3000);
	};
	function cycleGaming(){
		setTimeout(function(){
			(gamingPos < (gamingArray.length-1)) ? gamingPos+=1 : gamingPos = 0;
			$('#page-1-gaming').append("<img src='" + gamingArray[gamingPos] + "' class='project-img' style='display:none'>");
			$('#page-1-gaming img:last').fadeTo(1500, 1, function(){
				$('#page-1-gaming > img:first').remove();
			});
			cycleTheatrical();
		}, 3000);
	};
}

$(window).scroll(function(){
	if (!pageMeasure.$bottom) {
	 	var body = document.body,
			html = document.documentElement;
		pageMeasure.$bottom = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) - ( pageMeasure.$height + 300 );
	};

	var $scrollTop = $(window).scrollTop();

	if ($scrollTop > pageMeasure.$height-1) {
		$('nav').css({position: 'fixed', top: '0px'});
		$('#projectList').css({marginTop: '90px'});
	} else {
		$('nav').css({position:'relative'});
		$('#projectList').css({marginTop: '40px'});
	}

	// update navigation
	if ($scrollTop > (pageMeasure.$height-100) && $scrollTop < pageMeasure.$bottom  ) { // portfolio
 		$('#about-link').css({'border-bottom': '0px'});	
	 	$('#port-link').last().css({'border-bottom': '3px solid #488ee7'});
	} else if ($scrollTop <= pageMeasure.$height) { // top
 		$('#about-link').css({'border-bottom': '0px'});
	 	$('#port-link').css({'border-bottom': '0px'});
	} else if ($scrollTop >= pageMeasure.$bottom) { // about us
 		$('#about-link').css({'border-bottom': '3px solid #488ee7'});
	 	$('#port-link').css({'border-bottom': '0px'});
	}
});

$(window).resize(function() {

	$('#page-1').css({ height: $(window).height(), width: $(window).width() });
	$('#portfolio').css({ width: $(window).width() });
	$('#about-us').css({ height: $(window).height(), width: $(window).width() });

	pageMeasure.$height = $(window).height(); // reset for scrolling
 	var body = document.body,
		html = document.documentElement;
	pageMeasure.$bottom = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) - ( pageMeasure.$height + 300 );

});

function aboutUsCycle() {
	var onePos = 0, twoPos = 0, threePos = 0;
	$('#about-img-one').children('img').attr('src', img1Array[0]);
	$('#about-img-two').children('img').attr('src', img2Array[0]);
	$('#about-img-three').children('img').attr('src', img3Array[0]);
	cycleOne();

	function cycleOne(){
		setTimeout(function(){
			(onePos < (img1Array.length-1)) ? onePos += 1 : onePos = 0;
			$('#about-img-one').append("<img src='" + img1Array[onePos] + "' style='display:none'>");
			$('#about-img-one img:last-child').fadeTo(1500, 1, function(){
				$('#about-img-one img:first').remove();
			});
			cycleTwo();
		}, 3000);
	};
	function cycleTwo(){
		setTimeout(function(){
			(twoPos < (img2Array.length-1)) ? twoPos += 1 : twoPos = 0;
			$('#about-img-two').append("<img src='" + img2Array[twoPos] + "' style='display:none'>");
			$('#about-img-two img:last-child').fadeTo(1500, 1, function(){
				$('#about-img-two img:first').remove();
			});
			cycleThree();
		}, 3000);
	};
	function cycleThree(){
		setTimeout(function(){
			(threePos < (img3Array.length-1)) ? threePos += 1 : threePos = 0;
			$('#about-img-three').append("<img src='" + img3Array[threePos] + "' style='display:none'>");
			$('#about-img-three img:last-child').fadeTo(1500, 1, function(){
				$('#about-img-three img:first').remove();
			});
			cycleOne();
		}, 3000);
	};
}



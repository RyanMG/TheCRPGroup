var $height = $(window).height(); // cache to save memory

$(document).ready(function(){ 

  $('#content-wrapper').css('display','block');

	$('#page-1').css({ height: $(window).height(), width: $(window).width() }); 
	$('#about-us').css({ height: $(window).height(), width: $(window).width() }); 

	// UI click to scroll to
	$('nav').on('click', '.nav-icon', function(event) {
	   event.preventDefault();
	   var link = $(event.target).attr("rel");
		$('html, body').stop().animate({
			scrollTop: $(link).offset().top
		}, 1000, 'easeOutCubic');
	}); // page link

	$('#page-1').on('click', '#page-1-theatrical, #page-1-homeEnt, #page-1-gaming, #crp-logo', function(){
		$('html, body').stop().animate({
			scrollTop: $('nav').offset().top
		}, 1000, 'easeOutCubic');
	});

	$('#portfolio').on('click', '.theatrical-box, .homeEnt-box, .gaming-box', function(){
		var $this = $(this).attr('rel');
		$('#model-mask').fadeIn('800');
		$('#model-backer').fadeIn('800');
		$('.model-frame[rel="' + $this +'"]').fadeIn('800');
	});

	$('body').on('click','#model-mask, .close-button', function() {
		$('.model-frame').fadeOut('500');
		$('#model-backer').fadeOut('800');
		$('#model-mask').fadeOut('500');	
	});

	$('body').on('click', '.model-left-arrow', function(){
		var $this = $(this).parent();
		var id = parseInt($(this).parent().attr('rel'));
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
	});

	$('body').on('click', '.model-right-arrow', function(){
		var $this = $(this).parent();
		var id = parseInt($(this).parent().attr('rel'));
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
	  	initialize: function() {
	  		this.template = _.template($(this.options.templ).html());
	  	},
	  	render: function(){
	  		this.$el.html(this.template(this.model.toJSON()));
	  		return this;
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
			$('#page-1-theatrical img:last-child').fadeIn(1500, function(){
				$('#page-1-theatrical img:first').remove();
			});
			cycleHomeEnt();
		}, 3000);
	};
	function cycleHomeEnt(){
		setTimeout(function(){
			(homeEntPos < (homeEntArray.length-1)) ? homeEntPos+=1 : homeEntPos = 0;
			$('#page-1-homeEnt').append("<img src='" + homeEntArray[homeEntPos] + "' class='project-img' style='display:none'>");
			$('#page-1-homeEnt img:last-child').fadeIn(1500, function(){
				$('#page-1-homeEnt img:first').remove();
			});
			cycleGaming();
		}, 3000);
	};
	function cycleGaming(){
		setTimeout(function(){
			(gamingPos < (gamingArray.length-1)) ? gamingPos+=1 : gamingPos = 0;
			$('#page-1-gaming').append("<img src='" + gamingArray[gamingPos] + "' class='project-img' style='display:none'>");
			$('#page-1-gaming img:last-child').fadeIn(1500, function(){
				$('#page-1-gaming img:first').remove();
			});
			cycleTheatrical();
		}, 3000);
	};
}

$(window).scroll(function(){
	// fucked up workaround for finding the total height of the doc
	var body = document.body,
	    html = document.documentElement;
	var $bottom = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) - ( $height + 100 );

	var $scrollTop = $(window).scrollTop();

	// hide or show nav bar
	if ($scrollTop > $height) {
		$('nav').css({position: 'fixed', top: '0px'});
 		$('#projectList').css({marginTop: '90px'});
	} else {
		$('nav').css({position:'relative'});
 		$('#projectList').css({marginTop: '40px'});
	}

	// update navigation
	if ($scrollTop > ($height-100) && $scrollTop < $bottom  ) { // portfolio
 		$('#about-link').css({'border-bottom': '0px'});	
	 	$('#port-link').last().css({'border-bottom': '3px solid #488ee7'});
	} else if ($scrollTop <= $height) { // top
 		$('#about-link').css({'border-bottom': '0px'});
	 	$('#port-link').css({'border-bottom': '0px'});
	} else if ($scrollTop >= $bottom) { // about us
 		$('#about-link').css({'border-bottom': '3px solid #488ee7'});
	 	$('#port-link').css({'border-bottom': '0px'});
	}
});

$(window).resize(function() {
	$('#page-1').css({ height: $(window).height(), width: $(window).width() }); 
	$('#about-us').css({ height: $(window).height(), width: $(window).width() });

	$height = $(window).height();

});



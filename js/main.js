$(document).ready(function(){ 

  $('#content-wrapper').css('display','block');

	$('#page-1').css({ height: $(window).height(), width: $(window).width() }); 

	// UI click to scroll to
	$('nav').on('click', '.nav-icon', function(event) {
	   event.preventDefault();
	   var link = $(event.target).attr("rel");
		$('html, body').animate({
			scrollTop: $(link).offset().top
		}, 1000, 'easeOutCubic');
	}); // page link

	$('#page-1').on('click', '#page-1-theatrical, #page-1-homeEnt, #page-1-gaming, #crp-logo', function(){
		$('html, body').animate({
			scrollTop: $('#portfolio').offset().top
		}, 700, 'easeOutCubic');
	});

	// BACKBONE 

	 var masterProjectList;
	  $.getJSON('source/masterProjectList.json', function(data) {
	      masterProjectList = new ProjectList(data);
	      var masterListing = new ProjectListView();
	      pageOneCycle(data);
	  });

	  var Project = Backbone.Model.extend({
	    defaults: {
	      title: '',
	      client: '',
	      scope: '',
	      projectType: '',
	      mainImg: "http://placehold.it/318/220"
	    }
	  });

	  var ProjectList = Backbone.Collection.extend({
	    model: Project,
	  });

  	  var ProjectView = Backbone.View.extend({
	    tagName: "div", // this is unnecessary here as the default element is a div
	    className: "project-wrap",
	    initialize: function () {
	        this.template = _.template($(this.options.projectType).html());
	    },
	    render: function () {
	        this.$el.html(this.template(this.model.toJSON()));
	        return this;
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
	      var projectView;
	      switch (project.get("projectType")) {
	      	case "Theatrical":
		      projectView = new ProjectView({ model: project, projectType: '#theatricalProjectTemplate' });
	    	  break;
	    	case "Home Entertainment":  
		      projectView = new ProjectView({ model: project, projectType: '#homeEntProjectTemplate' });
	    	  break;
	    	case "Interactive Gaming":
		      projectView = new ProjectView({ model: project, projectType: '#gamingProjectTemplate' });
	    	  break;
	      };
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

	setInterval(function(){
		console.log(theatPos + " = " + theatArray[theatPos]);
		
		(theatPos < (theatArray.length-1)) ? theatPos+=1 : theatPos = 0;
		
		$('#page-1-theatrical > img').fadeOut('slow', function(){
			$(this).attr('src', theatArray[theatPos]).fadeIn('slow');	
		})
	}, 3000);
}

$(window).scroll(function(){
	var $scrollTop = $(window).scrollTop(),
		$height = $(window).height();	
	// hide or show nav bar
	if ($scrollTop > $height) {
		$('nav').css({position: 'fixed', top: '0px'});
 		$('#projectList').css({marginTop: '90px'});
	}
	if ($scrollTop <= $height) {
		$('nav').css({position:'relative'});
 		$('#projectList').css({marginTop: '40px'});
	}
});

$(window).resize(function() {
	$('#page-1').css({ height: $(window).height(), width: $(window).width() }); 
});
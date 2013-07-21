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

	$('#page-1').on('click', '#page-1-theatrical, #page-1-homeEnt, #page-1-gaming', function(){
		$('html, body').animate({
			scrollTop: $('#portfolio').offset().top
		}, 1000, 'easeOutCubic');
	});

	// BACKBONE 
	 var masterProjectList;

	  $.getJSON('source/masterProjectList.json', function(data) {
	      masterProjectList = new ProjectList(data);
	      var masterListing = new ProjectListView();
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
	    tagName: "div",
	    className: "project-wrap",
	    template: _.template($(this.options.templateType).html()),

	    render: function() {
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
	      var projectView = new ProjectView({model: project, templateType: "#theatricalProjectTemplate"});
	      this.$el.append(projectView.render().el);
	    }
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
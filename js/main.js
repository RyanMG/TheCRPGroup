var masterList = [

	{ 
		"title": "Beetlejuice: The Complete Series",
		"client": "Shout! Factory",
		"scope": "Design and Producion",
		"projectType": "Home Entertainment",
		"description": "Blah blah blah",
		"mainImg": "../images/gallery-he/beetlejuice.jpg",
		"fullImg": "../images/gallery-he/beelejuice-full.jpg"
	},
	{ 
		"title": "Galaxy Quest: Deluxe Edition",
		"client": "Paramount Home Entertainment",
		"scope": "Design",
		"projectType": "Home Entertainment",
		"description": "Blah blah blah",
		"mainImg": "../images/gallery-he/galaxyquest.jpg",
		"fullImg": "../images/gallery-he/galaxyquest-full.jpg"
	},
	{ 
		"title": "42",
		"client": "WArner Brothers",
		"scope": "Producion",
		"projectType": "Theatrical",
		"description": "Blah blah blah",
		"mainImg": "../images/gallery-th/42.jpg",
		"fullImg": "../images/gallery-th/42-full.jpg"
	},
	{ 
		"title": "The Campaign",
		"client": "Warner Brothers",
		"scope": "Producion",
		"projectType": "Theatrical",
		"description": "Blah blah blah",
		"mainImg": "../images/gallery-th/campaign.jpg",
		"fullImg": "../images/gallery-th/campaign-full.jpg"
	},
	{ 
		"title": "The Hobbit: And Unexpected Journey",
		"client": "Warner Brothers",
		"scope": "Producion",
		"projectType": "Theatrical",
		"description": "Blah blah blah",
		"mainImg": "../images/gallery-th/hobbit.jpg",
		"fullImg": "../images/gallery-th/hobbit-full.jpg"
	},
	{ 
		"title": "Harry Potter 7 Part II",
		"client": "Warner Brothers",
		"scope": "Producion",
		"projectType": "Theatrical",
		"description": "Blah blah blah",
		"mainImg": "../images/gallery-th/hp72.jpg",
		"fullImg": "../images/gallery-th/hp72-full.jpg"
	},
	{ 
		"title": "Jack the Gaint Killer",
		"client": "Warner Brothers",
		"scope": "Producion",
		"projectType": "Theatrical",
		"description": "Blah blah blah",
		"mainImg": "../images/gallery-th/jack.jpg",
		"fullImg": "../images/gallery-th/jack-full.jpg"
	},
	{ 
		"title": "Final Fantasy XIII-2",
		"client": "Square Enix",
		"scope": "Design and Production",
		"projectType": "Interactive Gaming",
		"description": "Blah blah blah",
		"mainImg": "../images/gallery-gam/ffxiii-2.jpg",
		"fullImg": "../images/gallery-gam/ffxiii-2-full.jpg"
	},
	{ 
		"title": "Metal Gear Rising: Revengeance",
		"client": "Konami",
		"scope": "Audio / Visual",
		"projectType": "Interactive Gaming",
		"description": "Blah blah blah",
		"mainImg": "../images/gallery-gam/mgrr.jpg",
		"fullImg": "../images/gallery-gam/mgrr-full.jpg"
	}
];

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
	var theatArray = [], homeEntArray = [], gamingArray = [];
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
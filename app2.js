//CREATED BY JAY PARCHURE FOR THE CHUTE PROGRAMMING CHALLENGE


(function() {
  var app = angular.module('chuteApp', ['chute', 'wu.masonry','ngDialog']);

    app.directive("stylesheets",function(){
    //New directive to combine all required CSS file into a separate HTML
  		return{
  			restrict: 'E',
  			templateUrl: 'stylesheets.html'
  		}
  });


  app.service('sharedProperties', function () {
  //Creating a new service so that resources could be shared by multiple controllers
        var assets = [];
        var pagination=null;
        return { //Getter and Setter functions
            getAssets: function () {return assets;},
            getPagination: function () {return pagination;},
            setAssets: function(value) {assets = value;},
            setPagination: function(value) {pagination = value;}
        };});


  
  app.controller("MyGalleryController", ['$http','$location','$anchorScroll', 'sharedProperties', function($http,$location,$anchorScroll,sharedProperties) {
  //Controller for Gallery
  var gallery= this;
  gallery.assets=[];
  	$http.get('https://api.getchute.com/v2/albums/aus6kwrg/assets').success(function(response){
  		//Making HTTP calls to get assets
  		gallery.assets=response.data;//Getting response data
  		sharedProperties.setAssets(gallery.assets);
  		//Setting assets via service
  		sharedProperties.setPagination(response.pagination);
  		//Setting pagination values via service
  		});
	}]);


  app.controller("MyScrollController", ['$http','$location','$anchorScroll','$timeout','sharedProperties', function($http,$location,$anchorScroll,$timeout,sharedProperties){
  //Controller to manage scrolls and pagination
  this.nextPage= function(){
  		url=sharedProperties.getPagination().next_page;//Define URL
  		assets=sharedProperties.getAssets();//get assets from service
  		$http.get(url).success(function(response){
  		//Make HTTP call to get resources
  			for (var i = 0; i < response.data.length; i++) {
        		assets.push(response.data[i]);
        		sharedProperties.setAssets(assets);
        		//Update assets with the new ones
      			}
  			sharedProperties.setPagination(response.pagination);
  			//update pagination with new ones
  		});
  		$timeout(function(){ //Wait for the images to load before scrolling
                $location.hash('bottom');
            	$anchorScroll(); //Scroll
        },50);
	
  };}]);


app.controller("MyLightboxController", function (ngDialog, $scope) {
	//Controller to implement basic Lightbox Logic
    $scope.clickToOpen = function (clickedAsset) {
    //Function takes the argument of the asset that was clicked on
        ngDialog.open({ replace: true,
        				closeByEscape: true,
        				template: "popup.html",
        				controller: function ($rootScope,$scope) {
        				 	$scope.url=clickedAsset.url + '/500x300';
        				 	//Set URL variable to be used by template
        				 	$scope.caption=clickedAsset.caption;	
        				 	//Set Caption variable to be used by template
        				 	$scope.showModal=true;
        				 	//Variable used to close modal
        					$scope.doClose=function(){
        					//Function to close modal
        					$scope.showModal=false;
        					};
        				 	}});
          };
});

  })();;











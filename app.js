var app = angular.module('collage', ['ngMaterial']);

app.controller('collageCtrl', function($scope, imageCollectionsData, Collage, ImageCollection) {
	$scope.collage = null;
	new ImageCollection(imageCollectionsData[0]).load().then(function(collection){
		$scope.collage = new Collage(collection.images, collection.images[0]);
	});
	
});
var app = angular.module('collage', ['ngMaterial']);

app.controller('collageCtrl', function($scope, imageCollectionsData, Collage, ImageCollection, ImageItem, GA) {
	new ImageCollection(imageCollectionsData[0]).load().then(function(collection) {
		$scope.collection = collection;
	});

	new ImageItem('https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Donald_Trump_August_2015.jpg/169px-Donald_Trump_August_2015.jpg')
		.load().then(function(imageItem) {
			$scope.target = imageItem;
		});

	$scope.runGA = function() {
		// quadruple the images
		var images = $scope.collection.images.concat($scope.collection.images).concat($scope.collection.images).concat($scope.collection.images);
		var ga = new GA(images, $scope.target);
		ga.notify = function() {
			$scope.$apply(function() {
				$scope.ga = ga;
				$scope.collage = new Collage(images, $scope.target, $scope.ga.fittest);
			});
		};
	};
});
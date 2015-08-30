// Not unit tests
// Just a page (test.html) and controller to instantiate directives and models independently from the main application

var app = angular.module('collage');

app.controller('collageTestCtrl', function($scope, $q, imageCollectionsData, Collage, ImageCollection, GA) {
	new ImageCollection(imageCollectionsData[0]).load().then(function(collection) {
		$scope.collection = collection;
		$scope.newRandomCollage();
	});

	$scope.newRandomCollage = function(){
		$scope.randomCollage = new Collage({
			images: $scope.collection.images,
			width: 200,
			height: 200,
			bgColor: {
				r:1,
				g:1,
				b:1
			},
			border: true
		});
	};

	$scope.runGA = function() {
		var ga = new GA({
			images: $scope.collection.images, 
			target: $scope.collection.images[0]
		});
		
		ga.notify = function() {
			$scope.$apply(function() {
				$scope.ga = ga;
				$scope.gaCollage = new Collage({
					images: $scope.collection.images,
					data: ga.fittestData,
					width: $scope.collection.images[0].original.width,
					height: $scope.collection.images[0].original.height,
					bgColor: {
						r:1,
						g:1,
						b:1
					},
					border: true
				});
			});
		};
	};
});
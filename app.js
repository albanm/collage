var app = angular.module('collage', ['ngMaterial', 'flow']);

app.controller('collageCtrl', function($scope, $q, imageCollectionsData, Collage, ImageCollection, ImageItem, GA, fileReader) {
	/*new ImageCollection(imageCollectionsData[0]).load().then(function(collection) {
		$scope.collection = collection;
	});*/

	/*new ImageItem('https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Blueye.JPG/245px-Blueye.JPG')
		.load().then(function(imageItem) {
			$scope.target = imageItem;
		});*/

	$scope.data = {};

	$scope.newRandomCollage = function(){
		$scope.collage = new Collage({
			images: $scope.collection.images,
			width: 900,
			height: 630,
			bgColor: {
				r:1,
				g:1,
				b:1
			},
			border: true
		});
	};

	$scope.collectionFlowComplete = function() {
		var filePromises = $scope.data.collectionFlow.files.map(function(flowFile) {
			return fileReader(flowFile.file);
		});
		$q.all(filePromises).then(function(filesData) {
			var collectionData = {
				title: 'local collection'
			};

			collectionData.images = filesData.map(function(fileData) {
				return {
					src: fileData
				};
			});
			new ImageCollection(collectionData).load().then(function(collection) {
				$scope.collection = collection;
				$scope.newRandomCollage();
			});
		});
	};

	$scope.targetFlowComplete = function() {
		fileReader($scope.data.targetFlow.files[0].file).then(function(fileData) {
			new ImageItem(fileData)
				.load().then(function(imageItem) {
					$scope.target = imageItem;
					$scope.runGA();
				});
		});
	};

	$scope.runGA = function() {
		// quadruple the images
		//var images = $scope.collection.images.concat($scope.collection.images).concat($scope.collection.images).concat($scope.collection.images);
		var ga = new GA({
			images: $scope.collection.images, 
			target: $scope.target
		});
		ga.notify = function() {
			$scope.$apply(function() {
				$scope.ga = ga;
				$scope.collage = new Collage({
					images: $scope.collection.images,
					data: ga.fittestData,
					width: $scope.target.original.width,
					height: $scope.target.original.height,
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
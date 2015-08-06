angular.module('collage').directive('imageCollection', ['$log', function($log) {
	return function link(scope, element, attributes) {
		var collection = scope.$eval(attributes.imageCollection);

		$log.debug('imageCollection directive - prepare rendering img elements from %i links', collection.links.length);

		collection.elements = [];
		collection.links.forEach(function(imageLink){
			var image = angular.element('<img src="' + imageLink + '">');
			element.append(image);
			collection.elements.push(image[0]);
		});

		element.imagesLoaded(function(){
			scope.$apply(function(){
				scope.collection.loaded = true;
			});
		});
	};
}]);

angular.module('angular').directive('imageCollection', ['$log', function() {
	function link(scope, element, attributes) {
		var collection = scope.$eval(attributes['image-collection']);

		$log.debug('imageCollection directive - prepare rendering img elements from %i links', collection.links.length);

		collections.elements = [];
		for(var imageLink in collection.links) {
			var image = angular.element('<img src="' + imageLink + '">');
			element.append(image);
			collections.elements.push(image);
		}
	}
}]);
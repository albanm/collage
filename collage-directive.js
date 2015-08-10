angular.module('collage').directive('collage', function() {
	return function link(scope, element, attributes) {
		var collage = scope.$eval(attributes.collage);
		element.append(collage.render());
	};
});
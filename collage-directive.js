angular.module('collage').directive('collage', function() {
	return function link(scope, element, attributes) {
		scope.$watch(attributes.collage, function(collage){
			element.empty();
			element.append(collage.render());
		});
	};
});
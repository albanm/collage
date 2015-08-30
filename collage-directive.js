angular.module('collage').directive('collage', function() {
	return function link(scope, element, attributes) {
		scope.$watch(attributes.collage, function(collage){
			element.empty();
			if (collage) {
				element.append(collage.render());
			}
		});
	};
});
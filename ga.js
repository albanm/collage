angular.module('collage').service('GA', function(Collage) {
	function GA(images, target) {
		var genetic = Genetic.create();

		genetic.optimize = Genetic.Optimize.Minimizer;
		genetic.select1 = Genetic.Select1.Tournament2;
		genetic.select2 = Genetic.Select2.Tournament2;

		genetic.seed = function() {
			return new Collage(images, target);
		};
	}

	return GA;
});
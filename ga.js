angular.module('collage').service('GA', function($log, Collage) {
  function GA(images, target) {
    var _this = this;

    // forces to use global vars with genetics-js
    window.Collage = Collage;
    window.collage = new Collage(images, target);

    var genetic = Genetic.create();

    genetic.optimize = Genetic.Optimize.Minimize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.Tournament2;

    genetic.seed = function() {
      return window.collage.randomData();
    };

    genetic.fitness = function(data) {
      window.collage.data = data;
      return window.collage.distance();
    };

    genetic.mutate = function(data) {
      return window.Collage.mutate(data);
    };

    genetic.crossover = function(motherData, fatherData) {
      return window.Collage.crossover(motherData, fatherData);
    };

    genetic.notification = function(pop, generation, stats, isFinished) {
      _this.isFinished = isFinished;
      _this.pop = pop;
      _this.generation = generation;
      _this.stats = stats;
      _this.fittest = pop[0].entity;
      $log.debug(stats);
    };

    genetic.evolve({
      webWorkers: false,
      iterations: 1000,
      maxResults: 1
    });

  }

  return GA;
});

angular.module('collage').service('GA', function($log, Collage, collageUtils) {
  function GA(images, target) {
    var _this = this;

    // forces to use global vars with genetics-js
    var collage = new Collage(images, target);

    var genetic = Genetic.create();

    genetic.optimize = Genetic.Optimize.Minimize;
    genetic.select1 = Genetic.Select1.Tournament2;
    genetic.select2 = Genetic.Select2.Tournament2;

    genetic.seed = function() {
      return this.userData.collageUtils.randomData(this.userData.dataSize);
    };

    genetic.fitness = function(data, callback) {
      var that = this;
      this.callerFunctions.getImageData(data, function(currentImageData){
        callback(that.userData.collageUtils.distanceRGB(that.userData.targetImageData, currentImageData));
      });
    };

    genetic.mutate = function(data) {
      return this.userData.collageUtils.mutate(data);
    };

    genetic.crossover = function(motherData, fatherData) {
      return this.userData.collageUtils.crossover(motherData, fatherData);
    };

    genetic.notification = function(pop, generation, stats, isFinished) {
      _this.generationN = _this.generationN === undefined ? 1 : _this.generationN + 1;
      _this.isFinished = isFinished;
      _this.pop = pop;
      _this.generation = generation;
      _this.stats = stats;
      _this.fittest = pop[0].entity;
      $log.debug(stats);
      if (_this.notify) {
        _this.notify();
      }
    };

    genetic.evolve(
      // config
    {
      //webWorkers: false,
      iterations: 4000,
      maxResults: 1,
      size: 100,
      crossover: 0.8,
      mutation: 0.3
    },
    // userData (serialized to the web worker)
    {
      collageUtils: collageUtils,
      dataSize: images.length,
      targetImageData: collage.targetImageData
    },
    // callerFunctions (called from the worker to this context using message passing)
    {
      getImageData: function(data, callback) {
        collage.data = data;
        collage.render();
        callback(collage.currentImageData);
      }
    });

    return this;
  }

  return GA;
});
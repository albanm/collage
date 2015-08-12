var app = angular.module('collage', ['ngMaterial']);

app.controller('collageCtrl', function($scope, imageCollectionsData, Collage, ImageCollection, GA) {
  new ImageCollection(imageCollectionsData[0]).load().then(function(collection) {
    $scope.ga = new GA(collection.images, collection.images[12]);
    $scope.collage = new Collage(collection.images, collection.images[12], $scope.ga.fittest);
  });
});

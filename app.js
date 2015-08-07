var app = angular.module('collage', ['ngMaterial']);

app.controller('collageCtrl', ['$scope', 'imageCollections', function($scope, imageCollections) {
  $scope.imageCollections = imageCollections;
}]);

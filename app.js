var app = angular.module('collage', ['ngMaterial']);

app.controller('collageCtrl', ['$scope', 'images', function($scope, images) {
  $scope.images = images;
}]);

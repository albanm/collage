angular.module('collage').service('fileReader', function($q){
	return function(file) {
		var deferred = $q.defer();
		var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function (event) {
          deferred.resolve(event.target.result);
        };
        fileReader.onerror = function (e) {
          deferred.reject(e);
        };
        return deferred.promise;
	};
	
});
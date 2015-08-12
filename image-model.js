angular.module('collage').service('ImageItem', function($q) {

  // Promisify native browser image loading
  function imagePromise(src, width, height) {
    var deferred = $q.defer();
    var img = new Image(width, height);

    // See cross-origin canvas issue: http://stackoverflow.com/questions/22097747/getimagedata-error-the-canvas-has-been-tainted-by-cross-origin-data
    img.crossOrigin = 'Anonymous';
    img.src = src;

    // See correct image pre-loading events: http://fragged.org/preloading-images-using-javascript-the-right-way-and-without-frameworks_744.html
    img.onerror = function(e) {
      deferred.reject(e);
    };

    img.onload = function() {
      deferred.resolve(img);
    };

    img.src = src;

    return deferred.promise;
  }

  ImageItem.prototype.load = function() {
    var _this = this;
    return imagePromise(_this.src).then(function(img) {
      _this.original = img;
      return imagePromise(_this.src, 20, img.height * (20 / img.width)).then(function(imgSmall) {
        _this.small = imgSmall;
        _this.loaded = true;
        return _this;
      });
    });
  };

  function ImageItem(src) {
    this.src = src;
  }

  return ImageItem;
});

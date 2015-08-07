angular.module('collage').directive('imageCollection', ['$log', function($log) {

  function getImageData(img, canvas, maxWidth) {
    var width = img.width;
    var height = img.height;
    if (maxWidth && maxWidth < img.width) {
      height = height * (maxWidth / width);
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, width, height);
    context.drawImage(img, 0, 0, width, height);
    return context.getImageData(0, 0, width, height);
  }

  function getData() {
    if (this._data) {
      return this._data;
    } else {
      this._data = getImageData(this.element, this.canvas);
      return this._data;
    }
  }

  function getDataSmall() {
    if (this._dataSmall) {
      return this._dataSmall;
    } else {
      this._dataSmall = getImageData(this.element, this.canvas, 40);
      return this._dataSmall;
    }
  }

  function Image(src) {
    this.src = src;

    // image.element should not be enumerable so it doesn't break stringify
    Object.defineProperty(this, 'element', {
      value: angular.element('<img src="' + src + '"></img>')[0],
      enumerable: false,
      writable: true
    });

    // See cross-origin canvas issue: http://stackoverflow.com/questions/22097747/getimagedata-error-the-canvas-has-been-tainted-by-cross-origin-data
    this.element.crossOrigin = 'Anonymous';

    // same for canvas used for image manipulation
    Object.defineProperty(this, 'canvas', {
      value: angular.element('<canvas></canvas>')[0],
      enumerable: false,
      writable: true
    });

    Object.defineProperty(this, 'data', {
      get: getData,
      enumerable: false
    });

    Object.defineProperty(this, 'dataSmall', {
      get: getDataSmall,
      enumerable: false
    });
  }

  return function link(scope, element, attributes) {
    var collection = scope.$eval(attributes.imageCollection);

    $log.debug('imageCollection directive - prepare rendering img elements from %i links', collection.images.length);

    collection.images.forEach(function(image, i) {
      collection.images[i] = new Image(image.src);
      element.append(collection.images[i].element);
    });

    element.imagesLoaded(function() {
      scope.$apply(function() {
        collection.loaded = true;
        collection.images[0].dataSmall;
        element.append(collection.images[0].canvas);
      });
    });
  };
}]);

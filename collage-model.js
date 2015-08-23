angular.module('collage').service('Collage', function(collageUtils) {

  function Collage(images, target, data) {
    this.images = images;
    this.target = target;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.target.original.width / 2;
    this.canvas.height = this.target.original.height / 2;
    this.context = this.canvas.getContext('2d');
    this.context.drawImage(this.target.original, 0, 0, this.canvas.width, this.canvas.height);
    this.targetImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.data = data || collageUtils.randomData(this.images.length);
  }

  Collage.prototype.render = function() {
    var _this = this;

    //$log.debug('[collage model] prepare rendering collage instance');
    //var d = new Date();

    // First item in data is the background color
    var bgColor = this.data[0];
    _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
    _this.context.fillStyle = 'rgb(' + Math.floor(bgColor.r * 256) + ',' + Math.floor(bgColor.g * 256) + ',' + Math.floor(bgColor.b * 256) + ')';
    _this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
    _this.context.save();

    var TO_RADIANS = Math.PI * 2;

    // All fllowing items are the positions of images
    // Create a clone to order them by z index before rendering
    var dataClone = this.data.slice(1);
    dataClone.sort(function(a, b) {
      return b.z - a.z;
    });

    
    dataClone.forEach(function(dataItem, i) {
      var prev = i > 0 ? dataClone[i - 1] : {
        x: 0,
        y: 0,
        r: 0
      };
      _this.context.rotate(-prev.r * TO_RADIANS);
      _this.context.translate(dataItem.x * _this.canvas.width - prev.x * _this.canvas.width, dataItem.y * _this.canvas.height - prev.y * _this.canvas.height);
      _this.context.rotate(dataItem.r * TO_RADIANS);
      var small = _this.images[i].small;
      _this.context.drawImage(small, -(small.width / 2), -(small.height / 2), small.width, small.height);
    });

    _this.context.restore();

    //$log.debug('[collage model] rendered img elements in %sms', new Date() - d);
    _this.currentImageData = _this.context.getImageData(0, 0, _this.canvas.width, _this.canvas.height);
    return _this.canvas;
  };

  return Collage;
});
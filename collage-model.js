angular.module('collage').service('Collage', function(collageUtils) {

  function Collage(options) {
    this.images = options.images;
    this.data = options.data || collageUtils.randomData(this.images.length);
    this.bgColor = options.bgColor || this.data[0];
    this.border = options.border || false;

    this.canvas = document.createElement('canvas');
    this.canvas.width = options.width;
    this.canvas.height = options.height;
    this.itemWidth = options.width / (Math.ceil(Math.sqrt(options.images.length)));
    this.context = this.canvas.getContext('2d');
  }

  Collage.prototype.render = function() {
    var _this = this;

    //$log.debug('[collage model] prepare rendering collage instance');
    //var d = new Date();

    // First item in data is the background color
    _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
    _this.context.fillStyle = 'rgb(' + Math.floor(_this.bgColor.r * 256) + ',' + Math.floor(_this.bgColor.g * 256) + ',' + Math.floor(_this.bgColor.b * 256) + ')';
    _this.context.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
    _this.context.save();

    var TO_RADIANS = Math.PI * 2;
    // Do not use full size of canvas to position center of items so that images dont get too much truncated
    var actualWidth = _this.canvas.width - _this.itemWidth;
    var actualHeight = _this.canvas.height - _this.itemWidth;
    _this.context.translate(_this.itemWidth / 2, _this.itemWidth / 2);

    // prepare shadows
    _this.context.shadowColor = '#888';
    _this.context.shadowBlur = 0;

    // All following items are the positions of images
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
      var tX = (dataItem.x - prev.x) * actualWidth;
      var tY = (dataItem.y - prev.y) * actualHeight;
      _this.context.translate(tX, tY);
      _this.context.rotate(dataItem.r * TO_RADIANS);
      //var small = _this.images[i].small;
      //_this.context.drawImage(small, -(small.width / 2), -(small.height / 2), small.width, small.height);
      var img = _this.images[i].original;
      var w = _this.itemWidth;
      var h = img.height * (w/img.width);
      var x = -(w / 2);
      var y = -(h / 2);
      

      if (_this.border) {
        _this.context.clearRect(x - 4, y - 4, w + 8, h + 8);
        _this.context.fillStyle = 'rgb(255,255,255)';
        _this.context.shadowBlur = 4;
        _this.context.fillRect(x - 4, y - 4, w + 8, h + 8);
        _this.context.shadowBlur = 2;
      }

      _this.context.drawImage(img, x, y, w, h);
    });

    _this.context.restore();

    //$log.debug('[collage model] rendered img elements in %sms', new Date() - d);
    _this.currentImageData = _this.context.getImageData(0, 0, _this.canvas.width, _this.canvas.height);
    return _this.canvas;
  };

  return Collage;
});
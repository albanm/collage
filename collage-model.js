angular.module('collage').service('Collage', function($log) {

	function Collage(images, target, data) {
		this.images = images;
		this.target = target;
		
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.target.original.width / 2;
		this.canvas.height = this.target.original.height / 2;
		this.context = this.canvas.getContext("2d");
		this.context.drawImage(this.target.original, 0, 0, this.canvas.width, this.canvas.height);
		this.targetImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.data = data || this.randomData();

		this.data.forEach(function(dataItem, i) {
			dataItem.image = images[i];
		});
	}

	Collage.prototype.randomData = function() {
		var _this = this;
		return this.images.map(function() {
			return {
				x: Math.random() * _this.canvas.width,
				y: Math.random() * _this.canvas.height,
				z: Math.random(),
				r: Math.random() * 360
			};
		});
	};

	Collage.prototype.fitness = function() {
		this.render();
		//var currentImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

		// Sources;
		// http://stackoverflow.com/questions/5392061/algorithm-to-check-similarity-of-colors-based-on-rgb-values-or-maybe-hsv
		// https://en.wikipedia.org/wiki/Color_difference
		// Utiliser HUSL (http://www.husl-colors.org/)

		return 1;
	};

	Collage.prototype.render = function() {
		var _this = this;

		$log.debug('[collage model] prepare rendering collage instance');
		var d = new Date();

		var TO_RADIANS = Math.PI / 180;

		var dataClone = this.data.slice(0);
		dataClone.sort(function(a, b) {
			return b.z - a.z;
		});

		_this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
		_this.context.save();
		dataClone.forEach(function(dataItem, i) {
			var prev = i > 0 ? dataClone[i - 1] : {
				x: 0,
				y: 0,
				r: 0
			};
			_this.context.rotate(-prev.r * TO_RADIANS);
			_this.context.translate(dataItem.x - prev.x, dataItem.y - prev.y);
			_this.context.rotate(dataItem.r * TO_RADIANS);
			var small = dataItem.image.small;
			_this.context.drawImage(small, -(small.width / 2), -(small.height / 2), small.width, small.height);
		});
		_this.context.restore();

		$log.debug('[collage model] rendered img elements in %sms', new Date() - d);

		return this.canvas;
	};

	return Collage;
});
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

	Collage.prototype.mutate = function() {
		//var _this = this;
		//var item = this.data[Math.floor(Math.random() * this.data.length)];
		return this;
	};

	Collage.prototype.distance = function() {
		this.render();

		$log.debug('[collage model] prepare processing collage distance with target');
		var d = new Date();

		var currentImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

		// see http://www.compuphase.com/cmetric.htm
		// for a weighted euclidian distance of 2 colors in RGB space
		var distances = [];
		var r1, r2, g1, g2, b1, b2, meanR, weightedR, weightedG, weightedB;
		for (var i = 0; i < currentImageData.data.length; i += 4) {
			r1 = currentImageData.data[i];
			r2 = this.targetImageData.data[i];
			g1 = currentImageData.data[i + 1];
			g2 = this.targetImageData.data[i + 1];
			b1 = currentImageData.data[i + 2];
			b2 = this.targetImageData.data[i + 2];
			// ignore transparency ?

			meanR = (r1 + r2) / 2;
			weightedR = (2 + meanR / 256) * Math.pow(r1 - r2, 2);
			weightedG = 4 * Math.pow(g1 - g2, 2);
			weightedB = (2 + ((255 - meanR) / 256)) * Math.pow(b1 - b2, 2);
			distances.push(Math.sqrt(weightedR + weightedG + weightedB));
		}

		var sum = distances.reduce(function(a, b) {
			return a + b;
		});

		$log.debug('[collage model] processed collage distance with target in %sms', new Date() - d);
		return sum / distances.length;
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
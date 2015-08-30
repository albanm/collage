angular.module('collage').service('collageUtils', function() {
	var utils = {};


	// prepare a random generator for mutation
	utils.random = new Random();

	// and assign own properties because serialization to web worker loses prototyping
	for (var k in utils.random) {
		Object.defineProperty(utils.random, k, {
			value: utils.random[k]
		});
	}

	// assign husl utilities
	utils.husl = $.husl;

	// and assign own properties because serialization to web worker loses prototyping
	for (k in utils.husl) {
		Object.defineProperty(utils.husl, k, {
			value: utils.husl[k]
		});
	}

	utils.randomData = function(n) {
		var data = [];

		// 1rst item is background color
		data.push({
			r: Math.random(),
			g: Math.random(),
			b: Math.random()
		});

		// then come images coordinates
		for (var i = 0; i < n; i++) {
			data.push({
				x: Math.random(),
				y: Math.random(),
				z: Math.random(),
				r: Math.random()
			});
		}
		return data;
	};

	utils.getImageData = function(img, width, height){
		var canvas = document.createElement('canvas');
    	canvas.width = width;
    	canvas.height = height;
    	var context = canvas.getContext('2d');
    	context.drawImage(img, 0, 0, width, height);
    	return context.getImageData(0, 0, width, height);
	};

	utils.mutate = function(data) {
		var that = this;
		data.forEach(function(item) {
			// Select data elements to mutate. 1 in 20, for now.
			if (Math.random() < 0.05) {
				// Select attribute (x,y,z or c) to mutate
				var keys = Object.keys(item);
				var attr = keys[Math.floor(Math.random() * keys.length)];

				// Use gaussian (=normal) distribution for level of mutation
				item[attr] = (item[attr] + that.random.normal(0, 0.1));
				item[attr] = item[attr] < 0 ? 0 : item[attr];
				item[attr] = item[attr] > 1 ? 1 : item[attr];
			}
		});

		return data;
	};

	utils.crossover = function(motherData, fatherData) {
		var daughterData = [];
		var sonData = [];

		motherData.forEach(function(item, i) {
			if (Math.random() < 0.5) {
				daughterData.push(item);
				sonData.push(fatherData[i]);
			} else {
				sonData.push(item);
				daughterData.push(fatherData[i]);
			}
		});

		return [daughterData, sonData];
	};

	// see http://www.compuphase.com/cmetric.htm
	// for a weighted euclidian distance of 2 colors in RGB space
	utils.distanceRGB = function(targetImageData, currentImageData) {
		//$log.debug('[collage model] prepare processing collage distance with target');
		//var d = new Date();
		var distances = [];
		var r1, r2, g1, g2, b1, b2, meanR, weightedR, weightedG, weightedB;
		for (var i = 0; i < currentImageData.data.length; i += 4) {
			r1 = currentImageData.data[i];
			r2 = targetImageData.data[i];
			g1 = currentImageData.data[i + 1];
			g2 = targetImageData.data[i + 1];
			b1 = currentImageData.data[i + 2];
			b2 = targetImageData.data[i + 2];
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

		//$log.debug('[collage model] processed collage distance with target in %sms', new Date() - d);
		return sum / distances.length;
	};

	// A custom formula using HUSL for human friendly color
	// Use this page to improve intuitive understanding: http://www.husl-colors.org/#implementations
	utils.distanceHUSL = function(targetImageData, currentImageData) {
		var distances = [];
		var husl1, husl2, h1, h2, s1, s2, l1, l2, h, s, l, lWeight, slWeight;
		for (var i = 0; i < currentImageData.data.length; i += 4) {
			husl1 = this.husl.fromRGB(targetImageData.data[i] / 255, targetImageData.data[i + 1] / 255, targetImageData.data[i + 2] / 255);
			husl2 = this.husl.fromRGB(currentImageData.data[i] / 255, currentImageData.data[i + 1] / 255, currentImageData.data[i + 2] / 255);
			h1 = husl1[0];
			h2 = husl2[0];
			s1 = husl1[1];
			s2 = husl2[1];
			l1 = husl1[2];
			l2 = husl2[2];

			// Difference in luminosity is the most important aspect to draw of good picture
			l = Math.pow(l2 - l1, 2);
			// Saturation has importance only insofar as luminosity of the target is medium (=50), at 0 or 100 luminosity saturation is meaningless
			lWeight = (l1 / 50);
			lWeight = lWeight > 1 ? (2 - lWeight) : lWeight;
			s = lWeight * Math.pow(s2 - s1, 2);
			// Saturation has importance only insofar as both luminosity is medium and saturation is high
			slWeight = lWeight * (s1 / 100);
			h = slWeight * Math.pow(h2 - h1, 2);
			distances.push(Math.sqrt(l + s + h));
		}

		var sum = distances.reduce(function(a, b) {
			return a + b;
		});

		//$log.debug('[collage model] processed collage distance with target in %sms', new Date() - d);
		return sum / distances.length;
	};

	// A mean delta luminance formula
	// cf https://en.wikipedia.org/wiki/Relative_luminance
	utils.distanceL = function(targetImageData, currentImageData) {
		var distances = [];
		var y1, y2;
		for (var i = 0; i < currentImageData.data.length; i += 4) {
			y1 = 0.2126 * targetImageData.data[i] + 0.7152 * targetImageData.data[i + 1] + 0.0722 * targetImageData.data[i + 2];
			y2 = 0.2126 * currentImageData.data[i] + 0.7152 * currentImageData.data[i + 1] + 0.0722 * currentImageData.data[i + 2];
			distances.push(Math.abs(y1 - y2));
		}

		var sum = distances.reduce(function(a, b) {
			return a + b;
		});

		//$log.debug('[collage model] processed collage distance with target in %sms', new Date() - d);
		return sum / distances.length;
	};

	return utils;
});
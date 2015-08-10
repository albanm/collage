angular.module('collage').service('ImageCollection', function($q, ImageItem) {

	ImageCollection.prototype.load = function() {
		var _this = this;
		return $q.all(_this.images.map(function(imageItem){
			return imageItem.load();
		})).then(function(){
			_this.loaded = true;
			return _this;
		});
	};

	function ImageCollection(data) {
		var _this = this;
		this.title = data.title;
		this.description = data.description;
		this.images = data.images;

		this.images.forEach(function(image, i) {
			_this.images[i] = new ImageItem(image.src);
		});
	}

	return ImageCollection;
});
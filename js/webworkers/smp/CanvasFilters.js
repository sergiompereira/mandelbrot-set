
/**
 * namespace pattern
 * @class CanvasBitmapData
 * @namespace smp.geom
 */

(function(){
	
	smp.namespace("smp.canvas.CanvasFilters");
	smp.canvas.CanvasFilters = (function()
	{
		//private properties
		var Constructor;
		
		//private methods
		
		//private
		function _saturate(originalImageData, value){
			
			var newImageData = _createEmptyImageData(originalImageData.width, originalImageData.height);
			var saturation = value;
			var i;
			var total = originalImageData.data.length;
			for(i = 0; i<total; i+=4){
				
				var colors = {};
				colors.r = originalImageData.data[i];
				colors.g = originalImageData.data[i+1];
				colors.b = originalImageData.data[i+2];
				colors.a = originalImageData.data[i+3];

				var rlum = 0.3;
				var glum = 0.59;
				var blum = 0.11;
			
				var dest = {};
				
				dest.r = ((rlum + (1.0 - rlum) * saturation) * colors.r) + ((glum + -glum * saturation) * colors.g) + ((blum + -blum * saturation) * colors.b);
				dest.g = ((rlum + -rlum * saturation) * colors.r) + ((glum + (1.0 - glum) * saturation) * colors.g) + ((blum + -blum * saturation) * colors.b);
				dest.b = ((rlum + -rlum * saturation) * colors.r) + ((glum + -glum * saturation) * colors.g) + ((blum + (1.0 - blum) * saturation) * colors.b);
				dest.a = colors.a;
				
				//grayscale
				//dest.r = dest.g = dest.b = (colors.r+colors.g+colors.b)/3.0;
				
		
				newImageData.data[i] = dest.r;
				newImageData.data[i+1] = dest.g;
				newImageData.data[i+2] = dest.b;
				newImageData.data[i+3] = dest.a;
				
			}
			return newImageData;
		}
		
		function _brighten(originalImageData, value){
			
			var newImageData = _createEmptyImageData(originalImageData.width, originalImageData.height);
			var brightness = value;
			var i;
			var total = originalImageData.data.length;
			for(i = 0; i<total; i+=4){
				
				var colors = {};
				colors.r = originalImageData.data[i];
				colors.g = originalImageData.data[i+1];
				colors.b = originalImageData.data[i+2];
				colors.a = originalImageData.data[i+3];
			
				var dest = {};
				
				dest.r = colors.r * brightness;
				dest.g = colors.g * brightness;
				dest.b = colors.b * brightness;
				dest.a = colors.a;
				
				newImageData.data[i] = dest.r;
				newImageData.data[i+1] = dest.g;
				newImageData.data[i+2] = dest.b;
				newImageData.data[i+3] = dest.a;
				
			}
			return newImageData;
		}
		
		function _contrast(originalImageData, value){
			
			var newImageData = _createEmptyImageData(originalImageData.width, originalImageData.height);
			var contrast = value;
			var i;
			var total = originalImageData.data.length;
			for(i = 0; i<total; i+=4){
				
				var colors = {};
				colors.r = originalImageData.data[i];
				colors.g = originalImageData.data[i+1];
				colors.b = originalImageData.data[i+2];
				colors.a = originalImageData.data[i+3];
			
				var dest = {};
				
				dest.r = ((colors.r - 125)*contrast)+ 125;
				dest.g = ((colors.g - 125)*contrast)+ 125;
				dest.b = ((colors.b - 125)*contrast)+ 125;
				dest.a = colors.a;
				
				newImageData.data[i] = dest.r;
				newImageData.data[i+1] = dest.g;
				newImageData.data[i+2] = dest.b;
				newImageData.data[i+3] = dest.a;
				
			}
			return newImageData;
		}
		
		function _getFilter(value){
			switch(value){
				case smp.canvas.CanvasFilters.SATURATION:
					return _saturateFunction;
					break;
				case smp.canvas.CanvasFilters.BRIGHTNESS:
					return _brightenFunction;
					break;
				case smp.canvas.CanvasFilters.CONTRAST:
					return _contrastFunction;
					break;
				default:
					return null;
					break;
			}
		}
		
		function _saturateFunction(obj, saturation)
		{
			var rlum = 0.3;
			var glum = 0.59;
			var blum = 0.11;
		
			var dest = {};
			
			dest.r = ((rlum + (1.0 - rlum) * saturation) * obj.r) + ((glum + -glum * saturation) * obj.g) + ((blum + -blum * saturation) * obj.b);
			dest.g = ((rlum + -rlum * saturation) * obj.r) + ((glum + (1.0 - glum) * saturation) * obj.g) + ((blum + -blum * saturation) * obj.b);
			dest.b = ((rlum + -rlum * saturation) * obj.r) + ((glum + -glum * saturation) * obj.g) + ((blum + (1.0 - blum) * saturation) * obj.b);
			dest.a = obj.a;
			
			return dest;
		}
		
		function _brightenFunction(obj, brightness)
		{
			var dest = {};
			
			dest.r = obj.r * brightness;
			dest.g = obj.g * brightness;
			dest.b = obj.b * brightness;
			dest.a = obj.a;
			
			return dest;
		}

		function _contrastFunction(obj, contrast)
		{
			var dest = {};
			
			dest.r = ((obj.r - 125)*contrast)+ 125;
			dest.g = ((obj.g - 125)*contrast)+ 125;
			dest.b = ((obj.b - 125)*contrast)+ 125;
			dest.a = obj.a;
			
			return dest;
		}
		
		function _createEmptyImageData(w,h){
			var tCanvas = document.createElement("canvas");
			return tCanvas.getContext("2d").createImageData(w,h);
		}
		
		//
		
		Constructor = function()
		{
			
		}
		
		//public
		Constructor.prototype = {
			//public properties (getters)

			//public methods
			saturate:_saturate,
			brighten:_brighten,
			contrast:_contrast,
			getFilter:_getFilter
			
		};
		
		return Constructor;
		
	}());
	
	smp.canvas.CanvasFilters.SATURATION = "saturation";
	smp.canvas.CanvasFilters.BRIGHTNESS = "brightness";
	smp.canvas.CanvasFilters.CONTRAST = "contrast";
	
	
}());



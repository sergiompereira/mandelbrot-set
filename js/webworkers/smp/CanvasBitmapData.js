
/**
 * namespace pattern
 * @class CanvasBitmapData
 * @namespace smp.canvas
 */

(function(){
	
	smp.namespace("smp.canvas.CanvasBitmapData");
	
	smp.canvas.CanvasBitmapData = (function()
	{
		//private properties
		var Constructor;

		var _context;
		
		var _imageWidth;
		var _imageHeight;
		var _bitmapData;
		var _colorUtils = smp.math.ColorUtils;
		
		//filters
		var filters = [];
		var filtersObj = new smp.canvas.CanvasFilters();

		
		//private methods (made public below)
		function _setBitmapData(imageData){
			_bitmapData = imageData;
		}
		
		
		function _getBitmapData(){
			return _bitmapData;
		}
		
		
		function _getPointAtIndex(id, bmpData){
			
			if(!bmpData || bmpData === "undefined"){		
				bmpData = _bitmapData;
			}
			
			var point = {};
			var tx = id%(bmpData.width * 4)/4;
			point.x = Math.floor(tx);
			var subindex = (tx%1) * 4 - 1;
			point.y = Math.floor((id/4)/bmpData.width);
			
			point.r = bmpData.data[id-subindex];
			point.g = bmpData.data[id-subindex+1];
			point.b = bmpData.data[id-subindex+2];
			point.a = bmpData.data[id-subindex+3];
			
			switch(subindex){
				case 0:
					point.color = "R";
					break;
				case 1:
					point.color = "G";
					break;
				case 2:
					point.color = "B";
					break;
				case 3:
					point.color = "A";
					break;
			}
			
			
			return point;
			
			
		}
		
		/**
		 * @param	int			x		:	horizontal position on the image data grid
		 * @param	int			y		: 	vertical position on the image data grid
		 * @param	ImageData	bmpData	:	the image data returned from the canvas 2d context method 'getImageData(x,y,w,h).
		 * @param	Boolean		hexColor:	if false, the method returns an object with properties id,r,g,b and a in decimal (0-255) values.
		 * 									If true, the method returns an object with properties id,r,g,b and a in hexadecimal values.	
		 */
		function _getDataAtPoint(x,y, bmpData, hexColor){
			
			if(!bmpData || bmpData === "undefined"){		
				bmpData = _bitmapData;
			}
			
			var id = y*bmpData.width*4+ x*4;
			var data = {};
			data.id = id;
			
			if(hexColor){
				var value,i,temp = [];
				for(i=0; i<4; i++){
					value = bmpData.data[id+i].toString(16);
					if(value.length < 2){
						value = '0'+value;
					}
					temp.push(value); 
				}
				
				data.r = temp[id];
				data.g = temp[id+1];
				data.b = temp[id+2];
				data.a = temp[id+3];
				
			}else{
				data.r = bmpData.data[id];
				data.g = bmpData.data[id+1];
				data.b = bmpData.data[id+2];
				data.a = bmpData.data[id+3];
			}
			
			return data;
		}
		
		function _setDataAtPoint(x,y, bmpData, color){
			if(!bmpData || bmpData === "undefined"){
				bmpData = _bitmapData;
			}
			var id = y*bmpData.width*4+ x*4;
			
			var color = _colorUtils.getColorParts(color,10);
			bmpData.data[id] = color.r;
			bmpData.data[id+1] = color.g;
			bmpData.data[id+2] = color.b;
			bmpData.data[id+3] = 255;
			
		}
		
		//
		
		function _addFilter(filter, value){
			
			var i;
			var filterExist = false;
			for(i=0; i<filters.length; i++){
				if(filters[i][0] == filter){
					filters[i][2] = value;
					filterExist = true;
					break;
				}
			};
			if(!filterExist) filters.push([filter, filtersObj.getFilter(filter), value]);
			
		}
		
		function _applyFilters(bmpData){
				
			if(!bmpData || bmpData === "undefined"){		
				bmpData = _bitmapData;
			}
			var newImageData = _createBitmapData(bmpData.width, bmpData.height);
			var i;
			var total = bmpData.data.length;
			for(i = 0; i<total; i+=4){
				
				var colors = {};
				colors.r = bmpData.data[i];
				colors.g = bmpData.data[i+1];
				colors.b = bmpData.data[i+2];
				colors.a = bmpData.data[i+3];
			
				var dest = {};
				dest.r = colors.r;
				dest.g = colors.g;
				dest.b = colors.b;
				dest.a = colors.a;
				
				var j;
				for(j=0; j<filters.length;j++){
					dest = filters[j][1](dest,filters[j][2]);
				}
				
				
				newImageData.data[i] = dest.r;
				newImageData.data[i+1] = dest.g;
				newImageData.data[i+2] = dest.b;
				newImageData.data[i+3] = dest.a;
				
			}
			return newImageData;
			
		}
		
		function _clearFilters(){
			filters.splice(0, filters.length);
		};
	

		
		//
		
		Constructor = function()
		{
			
		}
		
		//public
		Constructor.prototype = {
			//public properties (getters)

			//public methods
			setBitmapData: _setBitmapData,
			getBitmapData: _getBitmapData,
			getDataAtPoint:_getDataAtPoint,
			getPointAtIndex:_getPointAtIndex,
			setDataAtPoint:_setDataAtPoint,
			addFilter: _addFilter,
			applyFilters:_applyFilters,
			clearFilters:_clearFilters
			
		};
		
		return Constructor;
		
	}());

	
}());



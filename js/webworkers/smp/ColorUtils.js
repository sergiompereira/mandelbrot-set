/**
 * namespace pattern
 * @class GeometryUtils
 * @namespace smp.geom
 */

(function(){
	
	smp.namespace("smp.math.ColorUtils");
	
	//constructor (instance creation)
	smp.math.ColorUtils = (function()
	{
		var _value;
		var Constructor;
		
		
		Constructor = function()
		{
		
		}
		
		Constructor.prototype = {
			//public properties
			value:_value,
			version:"1.0"
			
			//public methods
			
		};
		
		return Constructor;
		
	}());
	
	//static methods
	
	/**
	 * @param	Number	color	:	in any base
	 * @param	int		to		:	which base the output should be in
	 */
	smp.math.ColorUtils.getColorParts = function(color,to){
	
		var hexParts = _getHexParts(color.toString(16));
		if(to == null || to == undefined) to = 16;
		if(to == 16){
			return {
				r: hexParts.r,
				g: hexParts.g,
				b: hexParts.b
			};
		}else if(to == 10){
			return {
				r: parseInt(hexParts.r,16),
				g: parseInt(hexParts.g,16),
				b: parseInt(hexParts.b,16)
			};
		}else if(to == 2){
			//to be continued
		}
		
		//internal function
		function _getHexParts(hexvalue){
			var len,r,g,b;
			len = hexvalue.toString().length;
			if(len <= 6){
				b = hexvalue.substr(len-2);
				g = hexvalue.substr(len-4,2);
				r;
				if(len==6){
					r = hexvalue.substr(0,2);
				}else{
					r = hexvalue.substr(0,1);
					r = '0'+r;
				}
				return {
					r: r,
					g: g,
					b: b
				};
			}else{
				//consider RGBA values...
			}
		}
	}
	
	/**
	*	Adds zeros to the left to match the specified length
	*/
	smp.math.ColorUtils.normalizeHexaValues = function(hexvalue,length){
	
		var len = hexvalue.length;
		var value = hexvalue;
		var diff,j;
	
		if(len < length){
			diff = length - len;
			for(j=0; j < diff; j++){
				value = '0'+value;
			}
		}
		return  value; 
		
	}
	
	
	/**
	 * Returns an array with the colors of the spectrum
	 * @param	hex		: Boolean, if true, returns the array with DomString Colors #rrggbb
	 * @returns Array
	 */
	smp.math.ColorUtils.spectrum = function(total, hex) 
	{
		
		var i,nRadians,nR,nG,nB,nColor,spectrumColors = [];
		var resolution = 360/total;
		
		for (i = 0; i <= 360; i+=resolution)
		{

			/*
			 * A little maths (bitwise operation):
			 * 00010111 LEFT-SHIFT =  00101110
			 * 00010111 RIGHT-SHIFT =  00001011
			 * 
			 * A left arithmetic shift by n is equivalent to multiplying by Math.pow(2,n), 
			 * while a right arithmetic shift by n is equivalent to dividing by Math.pow(2,n).
			 * 
			 * In C-inspired languages, the left and right shift operators are "<<" and ">>", respectively. 
			 * The number of places to shift is given as the second argument to the shift operators.
			 * x = y << 2;
			 */
			
			nRadians = i * (Math.PI / 180);
			nR = Math.cos(nRadians)                   * 127 + 128 << 16;
			nG = Math.cos(nRadians + 2 * Math.PI / 3) * 127 + 128 << 8;
			nB = Math.cos(nRadians + 4 * Math.PI / 3) * 127 + 128;
			   
			
			/*
			 * Some more maths (bitwise operation continued):
			 * The | (vertical bar) operator performs a bitwise OR on two integers. 
			 * Each bit in the result is 1 if either of the corresponding bits in the two input operands is 1. 
			 * For example, 0x56 | 0x32 is 0x76, because:

				  0 1 0 1 0 1 1 0
				| 0 0 1 1 0 0 1 0
				  ---------------
				  0 1 1 1 0 1 1 0

			 */

			 
			nColor  = nR | nG | nB;
			
			spectrumColors.push(nColor);
		}
		
		if(hex){
			var len = spectrumColors.length;
			var value,diff,j;
			for(i=0; i<len; i++){
				value = spectrumColors[i].toString(16);
				if(value.length < 6){
					diff = 6 - value.length;
					for(j=0; j < diff; j++){
						value = '0'+value;
					}
				}
				spectrumColors[i] = value; 
			}
		}
		
		
		return spectrumColors;	
	}
	
	smp.math.ColorUtils.crossColors =  function(initcolor, endcolor, coeff, callback) {
		
		var _self = smp.math.ColorUtils;
		var initHexParts = _self.getColorParts(initcolor,10);
		var endHexParts = _self.getColorParts(endcolor,10);
		var tempColor = {r:initHexParts.r, g:initHexParts.g, b:initHexParts.b};
		var tempHexColor = {};
		
		var timer = setInterval(updateColor, 200);
	
		
		function updateColor() {			
			if(Math.abs(tempColor.r-endHexParts.r)>=1 || Math.abs(tempColor.g-endHexParts.g)>=1 || Math.abs(tempColor.b-endHexParts.b)>=1){
			
				tempColor.r = tempColor.r + getNewValue(tempColor.r, endHexParts.r);
				tempColor.g = tempColor.g + getNewValue(tempColor.g, endHexParts.g);
				tempColor.b = tempColor.b + getNewValue(tempColor.b, endHexParts.b);
				if(tempColor.r > 255) tempColor.r = 255;
				if(tempColor.g > 255) tempColor.g = 255;
				if(tempColor.b > 255) tempColor.b = 255;
				if(tempColor.r < 0) tempColor.r = 0;
				if(tempColor.g < 0) tempColor.g = 0;
				if(tempColor.b < 0) tempColor.b = 0;
				
				tempHexColor.r = _self.normalizeHexaValues(Math.round(tempColor.r).toString(16),2);
				tempHexColor.g = _self.normalizeHexaValues(Math.round(tempColor.g).toString(16),2);
				tempHexColor.b = _self.normalizeHexaValues(Math.round(tempColor.b).toString(16),2);
				
				callback(tempHexColor);
			
			}else {
				clearInterval(timer);
			}
			
			
		}
		
		function getNewValue(orig, dest) {
			
			return (dest - orig) / coeff;
			
		}
		
		
	}

}());
    
importScripts("smp/smp.js", "smp/ColorUtils.js", "smp/CanvasFilters.js", "smp/CanvasBitmapData.js");

(function() {

	//The Mandelbrot Set
	//Daniel Shiffman <http://www.shiffman.net>
	//http://en.wikipedia.org/wiki/Mandelbrot_set
	
	//V. tb. Julia Set
	//http://en.wikipedia.org/wiki/Julia_set

	//The Mandelbrot set is the set of values of c in the complex plane 
	//for which the 'orbit of 0' [z(0) = 0] under iteration 
	//of the complex quadratic polynomial z(n+1) = z(n)^z(n) + c  remains bounded. 
	//(where c = x + yi)
	//That is, a complex number c is part of the Mandelbrot set if, 
	//when starting with z0 = 0 and applying the iteration repeatedly, 
	//the absolute value of zn remains bounded however large n gets.

	//Iterating Pc(z) starting at critical point z = 0, which either escapes to infinity or stays within a disk of some finite radius. 
	//The Mandelbrot set is defined as the set of all points c such that the above sequence does not escape to infinity.

	//Simple rendering of the Mandelbrot set
	//c = a + bi
	//Iterate z = z^2 + c, i.e.
	//z(0) = 0
	//z(1) = 0*0 + c
	//z(2) = c*c + c
	//z(3) = (c*c + c) * (c*c + c) + c
	//etc.

	//i^2 = -1;
	//c*c = (a+bi) * (a+bi) = a^2 - b^2 + 2abi

	//Created 2 May 2005

	//Define a squared canvas, to keep the ratio
	//a -> x, b -> y
	//each c = x + yi, is a pixel mapped from the complex plane to the canvas plane.
	
	//Establish a focal point and a range of values on the complex plane around that point
	//the Mandelbrot set scale is around the complex plane square area of x(-2.5,1) and y(-1,1)
	
	var xmin,ymin,xmax,ymax;
	var size = {w:1,h:1};
	
	function setFrame(x,y,zoom){
		
		var spanx0 = 1.5;
		var ratio = size.h/size.w;
		var spanx = spanx0/Math.pow(2,zoom-1);
		var spany = ratio * spanx;
		
		var point = {
				x : x/size.w*spanx0*2-spanx0,
				y : y/size.h*ratio*spanx0*2-ratio*spanx0
			};
		
		xmin = point.x - spanx;
		ymin = point.y - spany;
		xmax = point.x + spanx;
		ymax = point.y + spany;
	}

	//A different range will allow us to "zoom" in or out on the fractal
	//double xmin = -1.5; double ymin = -.1; double span = 0.15;

	//It can be proven that if in any iteration the value of the sequence is larger than 2!
	//than it will escape to infinity
	//Other values are used in computation to determine with finer grain the rate at which the sequence escapes to infinity
	//and creating more colorful renderings.
	var infinity = 2;
	
	
	var canvasdata = new smp.canvas.CanvasBitmapData();
	var console = {};
	console.log = function(message) {
		postMessage({
			"type" : "debug",
			"message" : message
		});

	};

	var processStack = [];
	
	var spectrum = smp.math.ColorUtils.spectrum(360);
	var colorNum = spectrum.length-1;
	
	this.addEventListener('message', function(e) {
		var data = e.data;
		if(data.action == 'init'){
			size = data.size;
		}else
		if (data.action == "computeFractal") {
			
			setFrame(data.point.x,data.point.y,data.zoom);
			canvasdata.setBitmapData(data.imageData);

			// Maximum number of iterations for each point on the complex plane
			// Greater the number, greater the accuracy is reached in the boundary areas of the Mandelbrot set
			// Useful only for large renderings
			var maxiterations = 3000;

			// Calculate amount we increment x,y for each pixel
			// its a mapping of the cartesian complex plane to the canvas coordinate plane
			var dx = (xmax - xmin) / (size.w);
			var dy = (ymax - ymin) / (size.h);

			// Start y
			var y = ymin;
			var j, i;
			for (j = 0; j < size.h; j++) {
				// Start x
				var x = xmin;
				for (i = 0; i < size.w; i++) {

					// Now we test, as we iterate z = z^2 + c, does z tend towards infinity?
					var a = x;
					var b = y;
					var n = 0;
					while (n < maxiterations) {

						var aa = a * a;
						var bb = b * b;
						var twoab = 2.0 * a * b;
						// Ver cálculo de complexos (C = R + I)
						// x = x^x - y^y + x0 (em R, parte real)
						// y = 2xy + y0 (em I, parte imaginária)
						a = aa - bb + x;
						b = twoab + y;
						//teorema de pitágoras
						if (aa + bb > infinity * infinity) {
							break; // Bail
						}
						n++;
					}

					// We color each pixel based on how long it took to get larger then our 'infinity'
					// If it never got there, than it belongs to the Mandelbrot set and we paint it black
					if (n == maxiterations)
						canvasdata.setDataAtPoint(i, j, null, '000000')
						// If we whish a crude shape, black and white, between points in and out of the Mandelbrot set
						//* else canvasdata.setDataAtPoint(i,j,null,'ffffff'); 
						// otherwise paint it with a color that represents the number of iterations needed to reach 'infinity'
					else
						canvasdata.setDataAtPoint(i, j, null,spectrum[colorNum-n%colorNum]);
						//canvasdata.setDataAtPoint(i, j, null,n%65536);

					/*
					 * The more colourful pictures usually seen are generated by colouring points 
					 * not in the set according to how quickly or slowly the sequence diverges to infinity.
					 */

					x += dx;
				}
				y += dy;
			}

			postMessage({
				"bmpData" : canvasdata.getBitmapData()
			});

		}
	}, false);

}());
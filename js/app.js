
if(!!document.createElement("canvas").getContext){
	
	var processStack = [];
		var canvas = document.getElementsByTagName('canvas')[0];
		var context = canvas.getContext('2d');
		
		var form = $('#controls');
		var oxl = $('input[name=oxl]');
		var oxm = $('input[name=oxm]');
		var oyl = $('input[name=oyl]');
		var oym = $('input[name=oym]');
		var ox = $('input[name=ox]');
		var oy = $('input[name=oy]');
		
		var displacement = 1;
		oxl.bind('click', function(){ox.val(+(ox.val())-displacement)});
		oxm.bind('click', function(){ox.val(+(ox.val())+displacement)});
		oyl.bind('click', function(){oy.val(+(oy.val())-displacement)});
		oym.bind('click', function(){oy.val(+(oy.val())+displacement)});
		
		var point = {x:+(ox.val()), y:+(oy.val())};
		var zoom = $('#zoom').val();
		
		
		var filtersWorker = new Worker('js/webworkers/mandelbrot.js');
		filtersWorker.postMessage({'action':'init', 
			'size':{w:canvas.width,h:canvas.height}});
		
		filtersWorker.onmessage = function (event) {
			if(event.data.type == "debug"){
//				console.log(event.data.message);
			}else{
				draw(event.data.bmpData, point);
			}
			
		};
		
		
		filtersWorker.postMessage({'action':'computeFractal', 
			'point':point, 
			'zoom':zoom,
			'imageData':canvas.getContext('2d').getImageData(0,0,canvas.width, canvas.height)
		});
		
		$(canvas).mouseup(function(e) {
			
				var editorOffset = $(this).offset();
				point = {x:Math.floor(e.pageX-editorOffset.left) ,y:Math.floor(e.pageY-editorOffset.top) };
				ox.val(point.x);
				oy.val(point.y);
				compute(point, zoom);
		});
		
		
		
		function onFormSubmit(evt){
			evt.preventDefault();
			
			$('input[type=submit]').get()[0].disabled = true;
			$('input[type=submit]').get()[0].style.opacity = '0.5';
			
			zoom = $('#zoom').val();
			displacement = 30/Math.pow(2,zoom-1);
			point = {x:+(ox.val()), y:+(oy.val())};
			compute(point,zoom);	
			
		}
		
		form.bind('submit', onFormSubmit);
		
		function compute(point,zoom){
				processStack.push({point:point,zoom:zoom});
				if(processStack.length>1){
//					console.log("wait");
				}else{
//					console.log("free to go");
					filtersWorker.postMessage({'action':'computeFractal', 
						'point':point, 
						'zoom':zoom,
						'imageData':canvas.getContext('2d').getImageData(0,0,canvas.width, canvas.height)
					});
				}
			
		}
		
		function draw(imageData, point){
			canvas.width = canvas.width;
			context.putImageData(imageData, 0,0);
			
			context.strokeStyle = '#990000';
			context.moveTo(point.x, point.y-5);
			context.lineTo(point.x, point.y+5);
			context.moveTo(point.x-5, point.y);
			context.lineTo(point.x+5, point.y);
			context.stroke();
			
//			console.log(processStack.length);
			if(processStack.length>1){
//				console.log("wait complete");
				var point = processStack[processStack.length-1].point;
				var zoom = processStack[processStack.length-1].zoom;
				processStack.splice(0,processStack.length);
				processStack.push({point:point,zoom:zoom});
				filtersWorker.postMessage({'action':'computeFractal', 'point':point, 'zoom':zoom,
					'imageData':canvas.getContext('2d').getImageData(0,0,canvas.width, canvas.height)});
			}else{
				processStack.splice(0,processStack.length);
			}
			$('input[type=submit]').get()[0].disabled = false;
			$('input[type=submit]').get()[0].style.opacity = '1';
		}
		
		
}
	
	
sheetSim = (function () {
	var exp = {};

	exp.TIMESTEP = 1 / 424;
	exp.TIMESTEP_SQ = exp.TIMESTEP * exp.TIMESTEP;

	// Changing this in console won't work b/c of slider - 
	//          Just rename the variable if you want to play

	/*   
	 * This frequency controls the number of time steps that it takes for the 
	 * for each axis to complete an orbit, independent of the size of that step.
	 *
	 */ 
	exp.yFreq = 1.5;
	exp.xFreq = 0;

	// Display options
	var xShift = 200;
	var yShift = 50;
	var scale = 300;

	var massSize = 5;
	var rotateCamera = true;
	var showMasses = true;

	exp.drive = 144;

	exp.system = sheetInit.system;
	exp.sheetGeometry = sheetInit.sheetGeometry;

	var lastTime;
	var step = 0;
	// Render loop, called by https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
	exp.simulate = function (time) {
		if (!lastTime) {
			lastTime = time;
			return;
		}

		if (step % 17 === 0 && step < 170) {
			console.log(step);
		}

		// can increase speed by doing multiple simulation steps per render step
		for (var i = 0; i < 2; i++) {
			exp.system.removePreviousSpringForces();
			exp.system.addSpringForces();

			for (var j = 0; j < exp.system.particles.length; j++) {
				exp.system.particles[j].stepForward(exp.TIMESTEP_SQ);
			}

			exp.system.enforceConstraints(step);
			step++;


			// // driving logic
			// if (exp.yFreq != 0) {
			var original = exp.system.particles[exp.drive].original;
		    exp.system.particles[exp.drive].position.setZ(Math.sin(step / 50 * exp.yFreq) / 5);
			exp.system.particles[exp.drive].position.setX(original.x);
			exp.system.particles[exp.drive].position.setY(original.y);
			// }
			// exp.system.fixedPoints[0].position.setX(Math.sin(step / 50 * exp.xFreq) / 10);
	//		exp.system.fixedPoints[0].position.setY(0);
		}

		// Draw the data to canvas https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

		var canvas = document.getElementById("sheet-canvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (i = 0; i < exp.system.springs.length; i++) {
			drawSpring(exp.system.springs[i], ctx);
		}

		
		for (i = 0; i < exp.system.particles.length; i++) {
			if (showMasses) {
				ctx.fillStyle = colors[0];

				var mSize = massSize;

				if (i != exp.drive) {
					ctx.fillStyle = colors[i % 3 + 7];
				}
				else {
					mSize = 10;
				}

				
				var part = exp.system.particles[i];
				ctx.fillRect(part.position.x * scale + xShift - mSize / 2, 
							 part.position.y * scale + yShift - mSize / 2, 
							 mSize, mSize);
			}
		}

	}

	var coilCount = 4;
	function drawSpring(spring, ctx) {
		var p1 = spring.p1;
		var p2 = spring.p2;

		ctx.beginPath();
		ctx.moveTo(p1.position.x * scale + xShift + massSize / 2, p1.position.y * scale + yShift);
		for (j = 1; j <= coilCount; j++) {
			var shift = j % 2 == 0 ?  massSize / 2 : - massSize / 2;
			if (j == coilCount) { shift = 0; }
			ctx.lineTo(((coilCount - j) * (p1.position.x + massSize / 2 / scale) + 
						          j * (p2.position.x -  massSize / 2 / scale) ) / coilCount * scale + xShift, 
				       ((coilCount - j) * p1.position.y + j * p2.position.y) / coilCount * scale + shift + yShift);
		} 

		ctx.lineWidth = 1;
		ctx.strokeStyle = colors[4]
		ctx.stroke();
		ctx.closePath()
	}

	timer = 0;
	exp.render = function() {
		if (!exp.system) {
			return;
		}

		var sheet = exp.system.particles;

        var shift = new THREE.Vector3( -.5, -.5, 0 );

		var il = sheet.length;
		for ( var i = 0; i < il; i ++ ) {
			exp.sheetGeometry.vertices[ i ]
				.copy( sheet[ i ].position )
				.add(shift)
				.multiplyScalar(350);

		}

		exp.sheetGeometry.computeFaceNormals();
		exp.sheetGeometry.computeVertexNormals();

		exp.sheetGeometry.normalsNeedUpdate = true;
		exp.sheetGeometry.verticesNeedUpdate = true;

		if (rotateCamera) { 
		//	sheetThree.scene.getObjectByName("sheet").rotation.x += .1;
			sheetThree.camera.position.x = Math.cos( timer / 500 ) * 1000;
			sheetThree.camera.position.z = Math.sin( timer / 500 ) * 1000;
			timer ++;
		}

		sheetThree.camera.lookAt( sheetThree.scene.position );

		sheetThree.renderer.render( sheetThree.scene, sheetThree.camera );

	}

	return exp;
}());
planeSim = (function () {
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
	var yShift = 100;
	var scale = 250;

	var massSize = 5;
	var rotateCamera = true;
	var showMasses = true;

	exp.drive = 0;

	exp.system = planeInit.system;
	exp.planeGeometry = planeInit.planeGeometry;

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

			if (exp.drive > 0) {
				var original = exp.system.particles[exp.drive].original;
			    exp.system.particles[exp.drive - 1].position.setZ(Math.sin(step / 200 * exp.yFreq) / 4 );
				exp.system.particles[exp.drive - 1].position.setX(Math.cos(step / 200 * exp.yFreq) / 2 );
				exp.system.particles[exp.drive - 1].position.setY(Math.sin(step / 50 * exp.yFreq) / 10);
			}
		}

		// Draw the data to canvas https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

		var canvas = document.getElementById("plane-canvas");
		var ctx = canvas.getContext("2d");
		var height = canvas.height;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (i = 0; i < exp.system.springs.length; i++) {
			drawSpring(exp.system.springs[i], ctx, height);
		}

		
		for (i = 0; i < exp.system.particles.length; i++) {
			if (showMasses) {
				ctx.fillStyle = colors[0];

				var mSize = massSize;

				if (i != exp.drive - 1) {
					ctx.fillStyle = colors[i % 3 + 7];
				}
				else {
					mSize = 10;
				}

				
				var part = exp.system.particles[i];
				ctx.fillRect(part.position.x * scale + xShift - mSize / 2, 
							 height - (part.position.y * scale + yShift + mSize / 2), 
							 mSize, mSize);
			}
		}

	}

	var coilCount = 4;
	function drawSpring(spring, ctx, height) {
		var p1 = spring.p1;
		var p2 = spring.p2;

		ctx.beginPath();
		ctx.moveTo(p1.position.x * scale + xShift + massSize / 2, height - (p1.position.y * scale + yShift));
		for (j = 1; j <= coilCount; j++) {
			var shift = j % 2 == 0 ?  massSize / 2 : - massSize / 2;
			if (j == coilCount) { shift = 0; }
			ctx.lineTo(((coilCount - j) * (p1.position.x + massSize / 2 / scale) + 
						          j * (p2.position.x -  massSize / 2 / scale) ) / coilCount * scale + xShift, 
				       height - (((coilCount - j) * p1.position.y + j * p2.position.y) / coilCount * scale + shift + yShift) );
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

		var plane = exp.system.particles;

		var shift = new THREE.Vector3( -.5, -.5, 0 );

		var il = plane.length;
		for ( var i = 0; i < il; i ++ ) {
			exp.planeGeometry.vertices[ i ]
				.copy( plane[ i ].position )
				.add(shift)
				.multiplyScalar(400);

		}

		exp.planeGeometry.computeFaceNormals();
		exp.planeGeometry.computeVertexNormals();

		exp.planeGeometry.normalsNeedUpdate = true;
		exp.planeGeometry.verticesNeedUpdate = true;

		if (rotateCamera) { 
			planeThree.scene.getObjectByName("plane").rotation.y -= .01;
			timer ++;
		}

		planeThree.camera.lookAt( planeThree.scene.position );

		planeThree.renderer.render( planeThree.scene, planeThree.camera );

	}

	return exp;
}());
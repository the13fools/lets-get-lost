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
	var xShift = 100;
	var yShift = 50;
	var scale = 300;

	var massSize = 15;

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
		    	exp.system.particles[0].position.setZ(Math.sin(step / 50 * exp.yFreq) / 5 + 1);
		//	    exp.system.particles[0].position.setX(0);
			// }
			// exp.system.fixedPoints[0].position.setX(Math.sin(step / 50 * exp.xFreq) / 10);
	//		exp.system.fixedPoints[0].position.setY(0);
		}

	}

	timer = 0;
	exp.render = function() {
		if (!exp.system) {
			return;
		}

		var sheet = exp.system.particles;

        var shift = new THREE.Vector3( -.5, -.5, -.5 );

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

		sheetThree.camera.lookAt( sheetThree.scene.position );

		sheetThree.renderer.render( sheetThree.scene, sheetThree.camera );

	}

	return exp;
}());
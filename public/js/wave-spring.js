waveEx = (function () {
	var exp = {};

	exp.n = 34; // number of nodes

	exp.MASS = 10; // kg
	exp.springRestDistance = 1 / (exp.n + 1); // m
	exp.springConstant = 100; // Newton / meter

	exp.DAMPING = 0.0001;

	exp.TIMESTEP = 1 / 300;
	exp.TIMESTEP_SQ = exp.TIMESTEP * exp.TIMESTEP;

	exp.lowerBound = .05 / exp.n;
	exp.upperBound = 1.2 / exp.n;

	// Changing this in console won't work b/c of slider - 
	//          Just rename the variable if you want to play

	/* 
	 * A note on units: Every time step is (by default) 1 / 10000 seconds.  
	 * This frequency controls the number of time steps that it takes for the 
	 * for each axis to complete an orbit.
	 *
	 */ 
	exp.yFreq = 1.35;
	exp.xFreq = 0;

	var ss = SpringSystem;

	function InitSystem() {
		var particles = [];
		var fixedPoints = [];
		var springs = [];

		fixedPoints.push(new ss.Particle(1, 0, 0, exp.MASS));

		for (i = 1; i <= exp.n; i ++) {
			particles.push(new ss.Particle(i / (exp.n + 1), 0, 0, exp.MASS));
		}

		// wire up the wave
		for (i = 0; i < exp.n - 1; i ++) {
			springs.push(new ss.Spring(
				particles[i],
				particles[i + 1],
				exp.springRestDistance, 
				exp.springConstant,
				exp.lowerBound,
				exp.upperBound));
		}

		springs.push(new ss.Spring(
			particles[exp.n - 1],
			fixedPoints[0],
			exp.springRestDistance, 
			exp.springConstant,
			exp.lowerBound,
			exp.upperBound));

		return [particles, fixedPoints, springs];
	}

	var init = InitSystem();
	// This is down here because function calls need to come after definitions.
	var system = new ss.System(init[0], init[1], init[2], exp.DAMPING);
	var driveTime = 0;
	system.addSpringForces();

	var lastTime;

	var drivingPosition = 0; 

	var xShift = 75;
	var yShift = 150;
	var scale = 550;

	var massSize = 15;

	exp.reset = function () {
		init = InitSystem();
		system = new ss.System(init[0], init[1], init[2], exp.DAMPING);
		system.addSpringForces();
	}

	var step = 0;
	// Render loop, called by https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
	exp.simulate = function (time) {
		if (!lastTime) {
			lastTime = time;
			return;
		}

		// can increase speed by doing multiple simulation steps per render step
		for (i = 0; i < 2; i++) {
			system.removePreviousSpringForces();
			system.addSpringForces();

			for (i = 0; i < system.particles.length; i++) {
				system.particles[i].stepForward(exp.TIMESTEP_SQ);
			}

			system.enforceConstraints(step);
			step++;


			// driving logic
			system.particles[0].position.setY(Math.sin(step / 25 * exp.yFreq) / 10);
			system.particles[0].position.setX(Math.cos(step / 25 * exp.xFreq) / 10);
		}

		// Draw the data to canvas https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

		var canvas = document.getElementById("waveex-canvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (i = 0; i < system.springs.length; i++) {
			drawSpring(system.springs[i], ctx);
		}

		
		for (i = 0; i < system.particles.length; i++) {
			ctx.fillStyle = colors[i % 3 + 1];
			var part = system.particles[i];
			ctx.fillRect(part.position.x * scale + xShift - massSize / 2, 
						 part.position.y * scale + yShift - massSize / 2, 
						 massSize, massSize);
		}

		ctx.fillStyle = colors[7];
		var point = system.fixedPoints[0];
		ctx.fillRect(point.position.x * scale + xShift - massSize / 2, 
					 point.position.y * scale + yShift - massSize / 2, 
					 massSize, massSize);

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
		ctx.stroke();
		ctx.closePath()
	}

	return exp;
}());

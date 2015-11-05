dofEx = (function () {
	var exp = {};

	exp.MASS = 1; // kg
	exp.springRestDistance = 1; // m
	exp.springConstant = 500; // Newton / meter

	exp.DAMPING = 0;

	exp.TIMESTEP = 1 / 300;
	exp.TIMESTEP_SQ = exp.TIMESTEP * exp.TIMESTEP;
	exp.lowerBound = .1;
	exp.upperBound = 3;

	// changing this in console won't work b/c of slider
	exp.initP1 = 1;
	exp.initP2 = 1.5;

	var ss = SpringSystem;

	function InitSystem() {
		var particles = [];
		var fixedPoints = [];
		var springs = [];
		var constraints = [];

		fixedPoints.push(new ss.Particle(0, 0, 0, exp.MASS));
		fixedPoints.push(new ss.Particle(3, 0, 0, exp.MASS));

		particles.push(new ss.Particle(exp.initP1, 0, 0, exp.MASS));
		particles.push(new ss.Particle(exp.initP2, 0, 0, exp.MASS));

		springs.push(new ss.Spring(
			fixedPoints[0],
			particles[0],
			exp.springRestDistance, 
			exp.springConstant,
			exp.lowerBound,
			exp.upperBound));

		springs.push(new ss.Spring(
			particles[0],
			particles[1],
			exp.springRestDistance, 
			exp.springConstant,
			exp.lowerBound,
			exp.upperBound));

		springs.push(new ss.Spring(
			particles[1],
			fixedPoints[1],
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

	var xShift = 50;
	var yShift = 100;
	var scale = 200;

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

		system.removePreviousSpringForces();
		system.addSpringForces();

		for (i = 0; i < system.particles.length; i++) {
			system.particles[i].stepForward(exp.TIMESTEP_SQ);
		}

		system.enforceConstraints(step);
		step++;

		// Draw the data to canvas https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

		var canvas = document.getElementById("dofex-canvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var part = system.particles[0];
		var wall = system.fixedPoints[0];

		for (i = 0; i < system.springs.length; i++) {
			drawSpring(system.springs[i], ctx);
		}

		ctx.fillStyle = colors[1];
		for (i = 0; i < system.particles.length; i++) {
			var part = system.particles[i];
			ctx.fillRect(part.position.x * scale + xShift - 25, part.position.y * scale + yShift - 25, 50, 50);
		}

	}

	function drawSpring(spring, ctx) {
		var p1 = spring.p1;
		var p2 = spring.p2;

		ctx.beginPath();
		ctx.moveTo(p1.position.x * scale + xShift + 25, p1.position.y * scale + yShift);
		for (j = 1; j <= 10; j++) {
			var shift = j % 2 == 0 ? 20 : -20;
			if (j == 10) { shift = 0; }
			ctx.lineTo(((10 - j) * (p1.position.x + 25 / scale) + j * (p2.position.x - 25 / scale) ) / 10 * scale + xShift, 
				       ((10 - j) * p1.position.y + j * p2.position.y) / 10 * scale + shift + yShift);
		} 

		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath()
	}

	return exp;
}());

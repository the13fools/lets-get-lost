ConstrainedEx = (function () {
	var exp = {};

	exp.MASS = 1; // kg
	exp.springRestDistance = 1; // m
	exp.springConstant = 50; // Newton / meter

	exp.TIMESTEP = 1 / 300;
	exp.TIMESTEP_SQ = exp.TIMESTEP * exp.TIMESTEP;

	exp.DAMPING = 0;

	// changing this in console won't work b/c of slider
	exp.initialXposition = 1.45;
	exp.lowerBound = .2;
	exp.upperBound = 2.5;

	var ss = SpringSystem;

	function InitSystem() {
		var particles = [];
		var fixedPoints = [];
		var springs = [];

		var center = new ss.Particle(0, 0, 0, exp.MASS);
		fixedPoints.push(center);
		particles.push(new ss.Particle(exp.initialXposition, 0, 0, exp.MASS));

		springs.push(new ss.Spring(
			fixedPoints[0],
			particles[0],
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

	var xShift = 150;
	var yShift = 100;

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

		// speed up animation by performing several simulation steps per render step
		for (var i = 0; i < 5; i++) {
			system.removePreviousSpringForces();
			system.addSpringForces();

			system.particles[0].stepForward(exp.TIMESTEP_SQ);
			system.enforceConstraints(step);
			step++;
		}

		// Draw the data to canvas https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

		var canvas = document.getElementById("constrainedex-canvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		var part = system.particles[0];
		var wall = system.fixedPoints[0];

		ctx.beginPath();
		ctx.moveTo(wall.position.x * 100 + xShift, wall.position.y * 100 + yShift);
		for (i = 1; i <= 10; i++) {
			var shift = i % 2 == 0 ? 20 : -20;
			ctx.lineTo(((10 - i) * wall.position.x + i * part.position.x) / 10 * 100 + xShift, 
				       ((10 - i) * wall.position.y + i * part.position.y) / 10 * 100 + shift + yShift);
		} 

		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.fillStyle = colors[1];
		ctx.fillRect(part.position.x * 100 + xShift, part.position.y * 100 + yShift - 25, 50, 50);

	}

	return exp;
}());
